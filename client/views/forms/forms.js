var paramId;
var currentForm;
var moveFieldFrom;
var formfields;
var reArrangedForm;
var formRendered = 0;
var SchemasFormFields;

Array.prototype.insert = function (index, item) {
this.splice(index, 0, item);
};


function getShiftObjs(nobj, one,two){

  var gkeys = Object.keys(nobj);

          var ascObj = [];
          var remain = [];

    for(var i=0; i<gkeys.length; i++){



      if(one == i){
       var g = {};
       g[gkeys[i]]    = nobj[gkeys[i]];
       ascObj.push(g);
      }

     if(two == i){
             var g = {};
       g[gkeys[i]]    = nobj[gkeys[i]];
       ascObj.push(g);

      }

      if(one !== i && two !== i ){

           var g = {};
           g[gkeys[i]]    = nobj[gkeys[i]];
           // console.log("oher obj ",g);

      }




    }
     return ascObj;

    // console.log(ascObj," Good things happen ");
}






function makeAsArray(nobj, one,two){

  var gkeys = Object.keys(nobj);


          var arr = [];

    for(var i=0; i<gkeys.length; i++){


           var g = {};
           var gg = {};

           g[gkeys[i]]    = nobj[gkeys[i]];

           arr.push(g);


    }
   return arr;
    console.log(arr," Good things happen ");
}



function shiftMerge (nobj,one,two) {



  shifObjs = getShiftObjs(nobj,one,two)
  g = makeAsArray(nobj,one,two)

  console.log(g," shiftObj ",shifObjs);

  // g[one] = shifObjs[1];
  // g[two] = shifObjs[0];

 console.log(g," after shiftObj ",shifObjs);
  return g;

}




Template.forms.helpers({

    form : function(){

          var form = WebForms.findOne(paramId);


          var nform  = JSON.parse(form['data']);


          

          currentForm  = nform;

          reArrangedForm = currentForm;
 

         var jsonNform = {}; 

                 var fieldKeys = Object.keys(currentForm);

            for (var i = 0; i < fieldKeys.length; i++) {

                if(currentForm[fieldKeys[i]].type == "String"){
                    currentForm[fieldKeys[i]].type = String;
                }

                if(currentForm[fieldKeys[i]].type == "Number"){
                    currentForm[fieldKeys[i]].type = Number;
                }

                jsonNform[fieldKeys[i]]  =  currentForm[fieldKeys[i]];


            };

            var children = $(".ui-sortable .form-group");

            console.log("children is here ",children," children len ",children.length);






          setTimeout(function(){

            var children = $(".ui-sortable .form-group");


            var fieldKeys = Object.keys(currentForm);


            console.log("fieldKeys ",fieldKeys," currentForm ",currentForm);


            for (var i = 0; i < fieldKeys.length; i++) {

                var nf ={};

                 if(currentForm[fieldKeys[i]].type.toString().indexOf("String") > 0){
                    currentForm[fieldKeys[i]].type = "String";
                }

                if(currentForm[fieldKeys[i]].type.toString().indexOf("Number") > 0){
                    currentForm[fieldKeys[i]].type = "Number";
                }

                nf[fieldKeys[i]] =  currentForm[fieldKeys[i]];

                $(children[i]).attr("data",JSON.stringify(nf));


            };


          },400);


          formRendered += 1;


          console.log(currentForm," 885  nform  588 ",formRendered," jsonNform ",jsonNform);              

            return {title : form.title, data : new SimpleSchema(jsonNform)};  
                    

    },
    formPrefields : function(){

          var keys = Object.keys(Schemas.Person);


          var prefields = $(".pre-field.ui-draggable");

          SchemasFormFields = Schemas.Person['_schemaKeys'];


          setTimeout(function(){

            var children = $(".pre-field.ui-draggable");
            var fieldKeys = Object.keys(currentForm);

            for (var i = 0; i < SchemasFormFields.length; i++) {
                var ngp = {};

                ngp[SchemasFormFields[i]] = json.Person[SchemasFormFields[i]];
                // console.log($(children[i])," child of prefields ",ngp);
                $(children[i]).attr("data",JSON.stringify(ngp));

            };


          },400);

          return SchemasFormFields;

    },



})


function fieldStart (e,ui) {

  console.log("Field drag start");

  moveFieldFrom = $(ui.item).index();

}


function fieldStop (e,ui) {

  console.log($(ui.item),"Field drag stop ",arguments,$(ui.item).index());

     setTimeout(function(){
      updateFormFields();
    },1000);



}

function updateFormFields () {



   var uiformfields = $(".ui-sortable .form-group");

      var narrangedField  =  {};
      var jsonStr = "";

      $.each(uiformfields,function(eles,i,ui){

           if($(ui).attr("data") !== undefined){


             var field  = JSON.parse($(ui).attr("data"));

             // console.log("field is ",$(ui).attr("data")," arg ",i," len ",ui," arg ",eles);   
             var ngkeys = Object.keys(field);

             jsonStr += $(ui).attr("data"); 

             if(eles.length-2 !== i ){
                jsonStr += ","; 
             }

              narrangedField[ngkeys[0]] = field[ngkeys[0]];

           }

        }.bind(null,uiformfields))

      


        // reArrangedForm = JSON.stringify(narrangedField);

        // console.log(jsonStr," narrangedField ",narrangedField); 

       WebForms.update(paramId,{$set: {data:JSON.stringify(narrangedField)}});      

       // $(".ui-draggable.form-group").remove();

}

function deleteFormField (fieldName) {

         // delete reArrangedForm[fieldName];

         // FormsCollections.update(paramId,{$set: {data:JSON.stringify(narrangedField)}});


}


 Template.forms.onRendered(function(){


      // console.log(arguments," form rendered here ",$(this.firstNode).find('.form-horizontal'));

       $(".pre-field").draggable({

       containment: "body",helper: "clone",connectToSortable: ".ui-sortable",       
         start : function(e,ui){
                  // console.log("drag start 8844",arguments, ui);
         },
         stop : function(e,ui){
            // console.log(json.Person[SchemasFormFields[$(ui.helper.context).index()]] ," drag stop 8855 ",arguments, $(ui.context));

            var newFound = $(".form-horizontal.ui-sortable").find(".pre-field");


            // console.log("newFound ",newFound);

            $(newFound).removeClass("pre-field");
            $(newFound).addClass("form-group");

            updateFormFields();
            

         },

       }) //No I18N

       $(this.firstNode).find('.form-horizontal').sortable({ containment: ".panel-body",

        });

       $(".ui-sortable").on("sortstart",fieldStart);    //No I18N
       $(".ui-sortable").on("sortstop",fieldStop); //No I18N
       $(".pre-field").on("dragEnd",prefieldDrag);    //No I18N


 });

 function prefieldDrag () {

      // console.log("drag here ");

 }

Meteor.startup( function () {


    Router.route('forms', {path: 'forms/:_id',

        data: function(){


            paramId = this.params._id;

        },

    });



});
