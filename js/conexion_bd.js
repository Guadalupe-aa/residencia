//const urlBase = `http://localhost:3000/`;
//const urlBase = 'https://agcvim.herokuapp.com/';
const urlBase = 'https://residencia-agcvim.herokuapp.com/';



export async function obtenerDatos(ruta) {
  try {
    const response = await axios.get(urlBase + ruta);
    return { 'data': response.data, 'status': response.status }
  } catch (error) {
    console.error(error);
  }
}
export async function guardarDato(ruta, data) {
  try {
    const response = await axios.post(urlBase + ruta, data);
    return { 'data': response.data, 'status': response.status }
  } catch (error) {
    console.error(error);
  }
}
export async function editarDato(ruta, data) {
  try {
    const response = await axios.put(urlBase + ruta, data);
    return { 'data': response.data, 'status': response.status }
  } catch (error) {
    console.error(error);
  }
}
export async function eliminarDato(ruta, id) {
  try {
    const response = await axios.delete(urlBase + ruta + '/' + id);
    return { 'data': response.data, 'status': response.status }
  } catch (error) {
    console.error(error);
  }
}
