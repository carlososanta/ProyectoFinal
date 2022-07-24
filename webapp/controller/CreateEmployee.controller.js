// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller, JSONModel, MessageBox) {
        'use strict';

        var Main = Controller.extend("logaligroup.finalproject.controller.CreateEmployee", {});

        function onInit() {
            this._wizard = this.byId("CreateEmployeeWizard");
            this._oNavContainer = this.byId("wizardNavContainer");
			this._oWizardContentPage = this.byId("wizardContentPage");

            // modelo vacio
            this.model = new sap.ui.model.json.JSONModel({});
            this.getView().setModel(this.model);
            // this.model.setProperty("/Type", "interno");
            this.model.setData({
                Type:"interno",
				FirstNameState: "Error",
				LastNameState: "Error",
				DniState: "Error"
			});
        };

        function setEmployeeTypeFromSegmented(oEvent) {
            var employeeType = oEvent.getParameters().item.getText();
            this.model.setProperty("/Type", employeeType);
            this._wizard.validateStep(this.byId("EmployeeTypeStep"));
            switch (employeeType) {
                case "interno": this.model.setProperty("/Salary", 24000); break;
                case "autonomo": this.model.setProperty("/Salary", 400); break;
                case "gerente": this.model.setProperty("/Salary", 70000); break;
            
                default:
                    break;
            }
        };

        function onValidateDNI(oEvent) {
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            var dni = oEvent.getParameter("value");
            var number;
            var letter;
            var letterList;
            var regularExp = /^\d{8}[a-zA-Z]$/;

            var employeeType = this.model.getProperty("/Type");
            if (employeeType != "autonomo") {

                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {
                    //Número
                    number = dni.substr(0, dni.length - 1);
                    //Letra
                    letter = dni.substr(dni.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        this.model.setProperty("/DniState", "Error");
                        sap.m.MessageToast.show(oResourceBundle.getText("dniNoOK"));
                        this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
                    } else {
                        //Correcto
                        this.model.setProperty("/DniState", "Success");
                        sap.m.MessageToast.show(oResourceBundle.getText("dniOK"));
                    }
                } else {
                    //Error
                    //Error
                    this.model.setProperty("/DniState", "Error");
                    sap.m.MessageToast.show(oResourceBundle.getText("dniNoOK"));
                    this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
                }

            }
        };

        function additionalInfoValidation(oEvent) {
            var firstName = this.byId("firstName").getValue();
            var lastName = this.byId("lastName").getValue();
            var dni = this.byId("dni").getValue();
            // var CreationDate = this.byId("CreationDate").getValue();

            this._wizard.validateStep(this.byId("EmployeeDataStep"));

            // if (isNaN(weight)) {
            // 	this._wizard.setCurrentStep(this.byId("EmployeeDataStep"));
            // 	this.model.setProperty("/productWeightState", "Error");
            // } else {
            // 	this.model.setProperty("/productWeightState", "None");
            // }

            if (firstName.length === 0) {
                this._wizard.setCurrentStep(this.byId("EmployeeDataStep"));
                this.model.setProperty("/FirstNameState", "Error");
                this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            } else {
                this.model.setProperty("/FirstNameState", "None");
            }

            if (lastName.length === 0) {
                this._wizard.setCurrentStep(this.byId("EmployeeDataStep"));
                this.model.setProperty("/LastNameState", "Error");
                this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            } else {
                this.model.setProperty("/LastNameState", "None");
            }

            var employeeType = this.model.getProperty("/Type");
            if (employeeType != "autonomo") {
                if (dni.length === 0) {
                    this._wizard.setCurrentStep(this.byId("EmployeeDataStep"));
                    this.model.setProperty("/DniState", "Error");
                    this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
                } else {
                    this.model.setProperty("/DniState", "None");
                }
            }

            // if (CreationDate) {
            //     this._wizard.setCurrentStep(this.byId("EmployeeDataStep"));
            //     this.model.setProperty("/CreationDateState", "Error");
            //     this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            // } else {
            //     this.model.setProperty("/CreationDateState", "None");
            // }

            // if (name.length < 6 || isNaN(weight)) {
            // 	this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
            // } else {
            // 	this._wizard.validateStep(this.byId("EmployeeDataStep"));
            // }
        };

        function onFileBeforeUpload (oEvent){
            let fileName = oEvent.getParameter("fileName");
            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name : "slug",
                value : this.getOwnerComponent().SapId + ";" 
                        + this.newUser + ";"
                        + fileName
            });
            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
        };

        function onFileChange (oEvent){
            // let oUploadCollection = oEvent.getSource();

            // let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
            //     name : "x-csrf-token",
            //     value : this.getView().getModel("employeesModel").getSecurityToken()
            // });

            // oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
        };

        function onFileUploadComplete (oEvent){
            // oEvent.getSource().getBinding("items").refresh();
        };

        function onFileDeleted (oEvent){
            // var oUploadCollection = oEvent.getSource();
            // var sPath = oEvent.getParameter("item").getBindingContext("employeesModel").getPath();
            // this.getView().getModel("employeesModel").remove(sPath, {
            //     success: function () {
            //         oUploadCollection.getBinding("items").refresh();
            //     },
            //     error: function (){

            //     }
            // }).bind(this);
        };

        function downloadFile (oEvent){
            const sPath = oEvent.getSource().getBindingContext("employeesModel").getPath();
            window.open("sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
        };

        function wizardCompletedHandler() {
			this._oNavContainer.to(this.byId("wizardReviewPage"));
		};

        function editStepOne  () {
			this._handleNavigationToStep(0);
		};

		function editStepTwo () {
			this._handleNavigationToStep(1);
		};

		function editStepThree () {
			this._handleNavigationToStep(2);
		};

        function _handleNavigationToStep (iStepNumber) {
			var fnAfterNavigate = function () {
				this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
				this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
			}.bind(this);

			this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
			this.backToWizardContent();
		};

        function handleWizardSubmit() {
			//this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
            var json = this.getView().getModel().getData();
            const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            
		    var body = {
                Type: (json.Type === 'interno' ? '0' : json.Type === 'autonomo' ? '1' : '2'),
                FirstName: json.FirstName,
                LastName: json.LastName,
                Dni: json.Dni,
                CreationDate: json.CreationDate,
                Comments: json.Comments,
                SapId: this.getOwnerComponent().SapId,
                UserToSalary: [{
                    Amount: parseFloat(json.Salary).toString(),
                    Comments : json.Comments,
			        Waers : "EUR"
                }]
            };
            // body.UserToSalary = [{
            //     Amount : parseFloat(json.Salary).toString(),
            //     Comments : json.Comments,
            //     Waers : "EUR"
            // }];
            this.getView().getModel("employeesModel").create("/Users",body,{
                success: function (data) {
                    this.newUser = data.EmployeeId;
                    this.onStartUpload();
                    MessageBox.success(oResourceBundle.getText("Save OK"));
                }.bind(this),
                error: function () {
                    MessageBox.error(oResourceBundle.getText("Not Save"));
                }.bind(this)
            });
      
            
		};

        function onStartUpload (ioNum) {
            var oUploadCollection = this.byId("uploadCollection");
            oUploadCollection.upload();
           };

        function backToWizardContent () {
			this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		};

        Main.prototype.onInit = onInit;
        Main.prototype.setEmployeeTypeFromSegmented = setEmployeeTypeFromSegmented;
        Main.prototype.onValidateDNI = onValidateDNI;
        Main.prototype.additionalInfoValidation = additionalInfoValidation;
        Main.prototype.onFileChange = onFileChange;
        Main.prototype.onFileUploadComplete = onFileUploadComplete;
        Main.prototype.onFileDeleted = onFileDeleted;
        Main.prototype.wizardCompletedHandler = wizardCompletedHandler;
        Main.prototype.editStepOne  = editStepOne ;
        Main.prototype.editStepTwo = editStepTwo;
        Main.prototype.editStepThree = editStepThree;
        Main.prototype._handleNavigationToStep = _handleNavigationToStep;
        Main.prototype.handleWizardSubmit = handleWizardSubmit;
        Main.prototype.backToWizardContent = backToWizardContent;
        Main.prototype.onStartUpload = onStartUpload;
        Main.prototype.onFileBeforeUpload = onFileBeforeUpload;
        Main.prototype.downloadFile = downloadFile;


        return Main;

    });