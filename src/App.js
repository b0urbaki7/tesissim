import logo from './logo.svg';
import './App.css';
import { Autocomplete, Icon, InputAdornment, Tab, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState, useEffect, useRef } from 'react';
import React from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import debounce from 'lodash.debounce';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import { createClient } from '@supabase/supabase-js'
import supabase from './supabaseClient'

//import { config } from '../Constants';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    backgroundColor: theme.palette.primary.light,
    fontSize: 14,
  },
}));

const production = {
  url: 'https://b0urbaki7.github.io'
};
const development = {
  url: 'http://localhost:3000'
};



export const config = process.env.NODE_ENV === 'development' ? development : production;

let respOpciones=[];
//let indiceSeleccionado=-1;

function Buscador({onChange}){
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = React.useState(options[0]);
  const [index, setIndex] = useState(-3);
  const loading = open && options.length === 0;
  let opcionesPrueba=[];
  //let index=-2;


  const filterOptions = createFilterOptions({
    ignoreAccents: true,
    ignoreCase: true,
    limit: 20
  });

  useEffect(() => {
    const fetchTesisTitulos = async () => {
      try {
        const { data, error } = await supabase.from('titulos').select();
        if (error) {
          console.error('Error fetching tesis titles:', error);
        } else {
          setOptions(data.map((tesis) => tesis.titulo));
          respOpciones = data.map((tesis) => [tesis.id, tesis.titulo]);
        }
      } catch (error) {
        console.error('Error fetching tesis titles:', error);
      }
    };
  
    fetchTesisTitulos();
  }, []);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleInputChange = async (event, newValue) => {
    const value = newValue ?? event.target.value; // Use newValue if provided, otherwise use event.target.value
    try {
      const { data, error } = await supabase
        .from('titulos')
        .select()
        .ilike('titulo', `%${value}%`);
  
      if (error) {
        console.error('Error fetching tesis titles:', error);
      } else {
        setOptions(data.map((tesis) => tesis.titulo));
        respOpciones = data.map((tesis) => [tesis.id, tesis.titulo]);
      }
    } catch (error) {
      console.error('Error fetching tesis titles:', error);
    }
  };
  
  return(
    
    <div>
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
        renderInput={(params) => <TextField {...params} label="Seleccione una tesis" onChange={(event, newValue) => {
          setValue(newValue);
          const selectedTesis = respOpciones.find(([_, titulo]) => titulo === newValue);
          const selectedIndex = selectedTesis ? selectedTesis[0] : -1;
          setIndex(selectedIndex);
          onChange(event, selectedIndex);
          handleInputChange(event, newValue); // Pass both event and newValue
        }} sx={{ width: 700 }}/>}
        filterOptions={filterOptions}
        //filterOptions={(x) => x}
        onChange={(event, newValue) => {
          setValue(newValue);
          const selectedTesis = respOpciones.find(([, titulo]) => titulo === newValue);
          const selectedIndex = selectedTesis ? selectedTesis[0] : -1;
          setIndex(selectedIndex);
          onChange(event, selectedIndex);
        }}
      ></Autocomplete>
    </div>
  )
}



function Tabla({indiceSeleccionado}){
  const [correlacionesPrueba, setCorrelacionesPrueba] = useState({});
  const [sortedData, setSortedData] = useState([]);

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

  /*useEffect(() => {
    const fetchCorrelationData = async () => {
      try {
        const { data, error } = await supabase.from('matriz').select();
        if (error) {
          console.error('Error fetching tesis matriz:', error);
        } else {
          setCorrelacionesPrueba(data.map((tesis) => tesis.titulo));
        }
      } catch (error) {
        console.error('Error fetching tesis matriz:', error);
      }
    };
  
    fetchTesisTitulos();
  }, []);*/

  useEffect(() => {
    const selectedEntry = indiceSeleccionado !== null ? correlacionesPrueba[indiceSeleccionado] : {};
    const dataArray = selectedEntry ? Object.entries(selectedEntry) : [];

    const sortedDataArray = dataArray.sort((a, b) => {
      return b[1] - a[1];
    });

    setSortedData(sortedDataArray);
  }, [indiceSeleccionado, correlacionesPrueba]);

  

  if ((Object.keys(correlacionesPrueba).length === 0)){
    return <div>Loading...</div>;
  }
  console.log(indiceSeleccionado);
  const selectedEntry = indiceSeleccionado !== null ? correlacionesPrueba[indiceSeleccionado] : {};


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
          {sortedData.length > 0 ? (
            sortedData.map(([titulo, correlacion], index) => (
              <TableRow key={index}>
                <TableCell><Button>{respOpciones[titulo]}</Button></TableCell>
                
                <TableCell align='center'>{correlacion}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>No hay información disponible</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


function App() {  

  const [indiceSeleccionado, setIndiceSeleccionado] = useState(null);

  const handleAutoCompleteChange = (event, newValue) => {
    setIndiceSeleccionado(newValue);
    console.log(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
    <div className="App">
      <header className="App-header">
        <Typography variant='h1'>TesisSim</Typography>
        <Typography variant='subtitle1'>Encuentra tesis similares (UNAM)</Typography>
        <Buscador onChange={handleAutoCompleteChange}/>
        <Tabla indiceSeleccionado={indiceSeleccionado}/>
      </header>
      
      
    </div>
    </ThemeProvider>
  );
}

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}


export default App;
