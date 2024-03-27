import logo from './logo.svg';
import './App.css';
import { Autocomplete, Icon, InputAdornment, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import debounce from 'lodash.debounce';


//import { config } from '../Constants';


const production = {
  url: 'https://b0urbaki7.github.io'
};
const development = {
  url: 'http://localhost:3000'
};
export const config = process.env.NODE_ENV === 'development' ? development : production;

let respOpciones=[];
let indiceSeleccionado=-1;

function Buscador(){
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = React.useState(options[0]);
  const [index, setIndex] = useState(-3);
  const loading = open && options.length === 0;
  const debouncedFetchOptionsRef = useRef();
  let opcionesPrueba=[];
  //let index=-2;


  const filterOptions = createFilterOptions({
    ignoreAccents: true,
    ignoreCase: true,
    limit: 20
  });

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    const fetchOptions = async () => {
      try{
        await fetch(config.url+"/tesissim/titulosNDup.json").then(resp=>resp.json()).then((json)=>opcionesPrueba=json);
        //Error en posicion 1253955
        //En cada registro 2000 termina un json y empieza otro, lo cual causa el error
        //await fetch(config.url+"/tesissim/matrizFinal.json").then(resp=>resp.json()).then((json)=>correlacionesPrueba=json);
      }catch (error){
        console.error('Error fetching data:', error);
      }
      if (active) {
        setOptions([...opcionesPrueba]);
        respOpciones=opcionesPrueba;
      }
    };

    debouncedFetchOptionsRef.current=debounce(fetchOptions, 300);

    return () => {
      active = false;
      debouncedFetchOptionsRef.current.cancel();
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleInputChange = (event, value) => {
    //setIsLoading(true);
    // Call the debounced fetchOptions function with the input value
    debouncedFetchOptionsRef.current(value);
  };
  
  return(
    
    <div>
      <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div>
      <div>{`msg: ${index !== null ? `'${index}'` : 'null'}`}</div>
      <Autocomplete 
        //freeSolo 
        componentsProps={{ popper: { style: { width: 700 } } }}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        options={options}
        loading={loading}
        //options={opcionesPrueba.map((option) => option)}
        renderInput={(params) => <TextField {...params} label="Seleccione una tesis" onChange={handleInputChange} sx={{ width: 700 }}/>}
        filterOptions={filterOptions}
        //filterOptions={(x) => x}
        onChange={(event, newValue) => {
          setValue(newValue);
          //index=respOpciones.findIndex(x=>x==newValue);
          setIndex(respOpciones.findIndex(x=>x==newValue));
          indiceSeleccionado=respOpciones.findIndex(x=>x==newValue);
          //console.log(index);
        }}
      ></Autocomplete>
    </div>
  )
}



function Tabla(){
  const [correlacionesPrueba, setCorrelacionesPrueba] = useState({});

  useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        const response = await fetch(`${config.url}/tesissim/matrizFinal.json`);
        const json = await response.json();
        setCorrelacionesPrueba(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCorrelationData();
  }, [config.url]);

  if ((Object.keys(correlacionesPrueba).length === 0)){
    return <div>Loading...</div>;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell align='center'>Correlación</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(correlacionesPrueba[indiceSeleccionado]).map(([titulo, correlacion], index) => (
            <TableRow key={index}>
              <TableCell>{respOpciones[titulo]}</TableCell>
              <TableCell align='center'>{correlacion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



function App() {  
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant='h1'>TesisSim</Typography>
        <Typography variant='subtitle1'>Find related theses (UNAM)</Typography>
        <Buscador/>
        
        <p>Running in {process.env.NODE_ENV}.</p>
        <p>La variable es {config.url+"/tesissim/titulosNDup.json"}</p>
        <Tabla/>
      </header>
      
      
    </div>
  );
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}


export default App;
