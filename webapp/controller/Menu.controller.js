sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast'
], 
/**
 * 
 * @param {sap.ui.core.mvc.Controller} Controller 
 * @param {sap.m.MessageToast} MessageToast
 */
function(Controller,MessageToast) {
    'use strict';
    
    var Main = Controller.extend("logaligroup.finalproject.controller.Menu",{});

    function onInit (){
        
    };

    function onCreateEmployee(oEvent){
        MessageToast.show("Create Employee");
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteCreate");
    };

    function onShowEmployee(oEvent){
        MessageToast.show("Show Employee");
    };

    Main.prototype.onInit = onInit;
    Main.prototype.onCreateEmployee = onCreateEmployee;
    Main.prototype.onShowEmployee = onShowEmployee;
    return Main;

});