import axios from 'axios';
const baseUrl = '/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => axios.post(baseUrl, newObject);

const remove = id => axios.delete(`${baseUrl}/${id}`);

const update = (henkilo) => {
  console.log('lähetys: ', henkilo);
  return axios.put(`${baseUrl}/${henkilo.id}`, henkilo);
};

export default { getAll, create, remove, update };