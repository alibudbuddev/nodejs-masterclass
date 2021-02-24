const NJSMC_FORM = {
  serialize: (elements) => {
    const payload = {};
    for(var i = 0; i < elements.length; i++){
      if(elements[i].type !== 'submit'){
        // Determine class of element and set value accordingly
        var classOfElement = typeof(elements[i].classList.value) == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';
        var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[i].checked : classOfElement.indexOf('intval') == -1 ? elements[i].value : parseInt(elements[i].value);
        var elementIsChecked = elements[i].checked;
        // Override the method of the form if the input's name is _method
        var nameOfElement = elements[i].name;
        if(nameOfElement == '_method'){
          method = valueOfElement;
        } else {
          // Create an payload field named "method" if the elements name is actually httpmethod
          if(nameOfElement == 'httpmethod'){
            nameOfElement = 'method';
          }
          // Create an payload field named "id" if the elements name is actually uid
          if(nameOfElement == 'uid'){
            nameOfElement = 'id';
          }
          // If the element has the class "multiselect" add its value(s) as array elements
          if(classOfElement.indexOf('multiselect') > -1){
            if(elementIsChecked){
              payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
              payload[nameOfElement].push(valueOfElement);
            }
          } else {
            payload[nameOfElement] = valueOfElement;
          }

        }
      }
    }

    return payload;
  },

  toggleAlerts: (formId) => {
    // Hide the error message (if it's currently shown due to a previous error)
    document.querySelector('#'+formId+' .formError').style.display = 'none';

    // Hide the success message (if it's currently shown due to a previous error)
    if(document.querySelector('#'+formId+' .formSuccess')){
      document.querySelector('#'+formId+' .formSuccess').style.display = 'none';
    }
  },

  getFormMeta: (e) => {
    const formId = e.target.getAttribute('id');
    const path = e.target.getAttribute('action');
    const method = e.target.getAttribute('method').toUpperCase();
    return {formId, path, method};
  }
};