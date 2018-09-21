const fs = require('fs');
const path = require('path'); 

function getAngularType(typescript) {
  return typescript.match(/^@Component\(/m) ? 'Component': 
    typescript.match(/^@Directive\(/m) ? 'Directive': 
    typescript.match(/^@Injectable\(/m) ? 'Injectable': 
    typescript.match(/^@Pipe\(/m) ? 'Pipe':  undefined;
}

function getEjsTemplate(type) {
  let ejsFile; 
  switch(type) {
    case 'Component':
    case 'Directive':
    case 'Pipe':
    case 'Injectable':
      const typeLower = type.toLowerCase();
      ejsFile = path.join(__dirname, '../', 'templates', `${typeLower}.spec.ts.ejs`);
      break;
    default:
      ejsFile = path.join(__dirname, '../', 'templates', `default.spec.ts.ejs`);
      break;
  }

  return fs.readFileSync(ejsFile, 'utf8');
}

function getImportLib(mports, className) {
  let lib;
  mports.forEach(mport => {
    if (mport.specifiers) {
      mport.specifiers.forEach(el => { // e.g. 'Inject', 'Inject as foo'
        if (el === className) {
          lib = mport.from; // e.g. '@angular/core'
        }
      });
    }
  });

  return lib;
}

function reIndent(str, prefix="") {
  let toRepl = str.match(/^\n\s+/)[0];
  let regExp = new RegExp(toRepl, 'gm');
  return str.replace(regExp, "\n" + prefix);
}

function removeDuplicates(arr){
  let unique_array = [];
  let strUniqueArr = [];
  if(!arr) return [];
  for(let i = 0; i < arr.length; i++){
      if(strUniqueArr.indexOf(JSON.stringify(arr[i])) == -1){
          strUniqueArr.push(JSON.stringify(arr[i]));
          unique_array.push(arr[i]);
      }
  }
  return unique_array;
}

module.exports = {
  getAngularType,
  getEjsTemplate,
  getImportLib,
  reIndent,
  removeDuplicates,
};
