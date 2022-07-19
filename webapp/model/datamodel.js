sap.ui.define([], function() {
	"use strict";

	return {
        Header:{
            Auart:"",
            FuncName:"",
            Vkorg:"",
            Vtweg:"",
            Spart:"",
            Vkbur:"",
            Vkgrp:"",
            Kunnr:"",
            Zterm:"",
            Orderno:"",
            Inco1:"",
            Inco2:"",
            Detail:[]
        },
        HeaderText:{
            AuartDesc:"",
            VkorgDesc:"",
            VtwegDesc:"",
            SpartDesc:"",
            VkburDesc:"",
            VkgrpDesc:"",
            CustomerName:"",
            ZtermDesc:"",
            Inco1Desc:""
        },
        Item:{
            KosulTuru1 :null,
            Posnr:0,
            KosulTutari1:null,
            Material:null,
            MaterialDesc:null,
            KosulTabani1:null,
            RefDocNo:null,
            RefDocItm:null,
            Miktar:null,
            Meins:null,
            BrmFyt:null,
            Deger:null,
            Waers:null,
            TerminTarihi: null,
            Simulate:false,
            Usability:[]
        },
        Usability:{
            Vbeln:"",
            Posnr:"",
            TerminTarihi:null,
            TerminMik:null,
            Meins:null
        },
        mainView:{
            bEdit:true,
            bCustomerRef:false,
            delay:0
        }
    }
});