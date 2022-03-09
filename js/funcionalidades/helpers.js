export function on(element, event, selector, handler){
  element.addEventListener(event, e => {
      if(e.target.closest(selector)){
          handler(e);
      }
  });
}
export function generarCSV(selector){
  let table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll(`#${selector}`));
}
export function generarPDF(selector){
  let element = document.getElementById(selector);
  let opt = {
    margin:  0.5,
    filename: 'file.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1.5 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'l' }
  };
  html2pdf().from(element).set(opt).save();
}
