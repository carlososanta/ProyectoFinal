sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"
    ],
    function (Controller, MessageBox) {
        "use strict";

        var main = Controller.extend("logaligroup.finalproject.controller.ViewEmployee", {});


        function onInit() {
            this._splitAppEmployee = this.byId("SplitAppDemo");
        };

        function onItemPress(oEvent) {
            this._splitAppEmployee.to(this.createId("detailDetail"));
            var context = oEvent.getParameter("listItem").getBindingContext("employeesModel");
            this.employeeId = context.getProperty("EmployeeId");
            var detailEmployee = this.byId("detailDetail");
            detailEmployee.bindElement("employeesModel>/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");
        };

        function onDownloadFile(oEvent) {
            const sPath = oEvent.getSource().getBindingContext("employeesModel").getPath();
            window.open("sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
        };

        function onFileBeforeUpload(oEvent) {
            let fileName = oEvent.getParameter("fileName");
            let objContext = oEvent.getSource().getBindingContext("employeesModel").getObject();
            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: this.getOwnerComponent().SapId + ";"
                    + objContext.EmployeeId + ";"
                    + fileName
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        };

        function onFileChange(oEvent) {
            let oUploadCollection = oEvent.getSource();

            let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                name: "x-csrf-token",
                value: this.getView().getModel("employeesModel").getSecurityToken()
            });

            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        };

        function onFileUploadComplete(oEvent) {
            oEvent.getSource().getBinding("items").refresh();
        };

        function onFileDeleted(oEvent) {
            var oUploadCollection = oEvent.getSource();
            var sPath = oEvent.getParameter("item").getBindingContext("employeesModel").getPath();
            this.getView().getModel("employeesModel").remove(sPath, {
                success: function () {
                    oUploadCollection.getBinding("items").refresh();
                },
                error: function () {

                }
            }).bind(this);
        };

        function onFiredUp() {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox["confirm"](oResourceBundle.getText("deleteConfirm"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        this.getView().getModel("employeesModel").remove(
                            "/Users(SapId='" + this.getOwnerComponent().SapId +
                            "',EmployeeId='" + this.employeeId + "')"
                            , {
                                success: function (data) {
                                    MessageBox.success(oResourceBundle.getText("deleteOk"));
                                    this._splitAppEmployee.to(this.createId("detail"));
                                    var employeesList = this.getView().byId("employeesList");
                                    employeesList.getBinding("items").refresh(true);
                                }.bind(this),
                                error: function () {
                                    MessageBox.error(oResourceBundle.getText("deleteNotOk"));
                                }.bind(this)
                            });
                    }
                }.bind(this)
            });

        };

        function onPromote(oEvent) {
            if (!this.promoteDialog) {
                this.promoteDialog = sap.ui.xmlfragment("logaligroup/finalproject/fragment/DialogPromote", this);
                this.getView().addDependent(this.promoteDialog);
            }
            this.promoteDialog.setModel(new sap.ui.model.json.JSONModel({}), "promote");
            this.promoteDialog.open();
        };

        function onDialogOk() {
            //this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
            var json = this.promoteDialog.getModel("promote").getData();
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            var body = {
                EmployeeId: this.employeeId,
                CreationDate: json.CreationDate,
                SapId: this.getOwnerComponent().SapId,
                Amount: parseFloat(json.Salary).toString(),
                Comments: json.Comments,
                Waers: "EUR"
            };
            this.getView().getModel("employeesModel").create("/Salaries", body, {
                success: function (data) {
                    MessageBox.success(oResourceBundle.getText("SaveOK"));
                    this.promoteDialog.close();
                    var idTimeline = this.getView().byId("idTimeline");
                }.bind(this),
                error: function () {
                    MessageBox.error(oResourceBundle.getText("NotSave"));
                    this.promoteDialog.close();
                }.bind(this)
            });


        }

        function onDialogCancel() {
            this.promoteDialog.close();
        }



        main.prototype.onInit = onInit;
        main.prototype.onItemPress = onItemPress;
        main.prototype.onDownloadFile = onDownloadFile;
        main.prototype.onFileBeforeUpload = onFileBeforeUpload;
        main.prototype.onFileChange = onFileChange;
        main.prototype.onFileUploadComplete = onFileUploadComplete;
        main.prototype.onFileDeleted = onFileDeleted;
        main.prototype.onFiredUp = onFiredUp;
        main.prototype.onPromote = onPromote;
        main.prototype.onDialogOk = onDialogOk;
        main.prototype.onDialogCancel = onDialogCancel;

        return main;

    }
);
