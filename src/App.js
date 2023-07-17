import logo from './logo.svg';
import './App.css';
import { Icon, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';


function Buscador(){
  return(
    <div>
      <TextField 
        label="Ingrese su búsqueda"
        InputProps={{endAdornment:(<InputAdornment position='start'><SearchIcon></SearchIcon></InputAdornment>),}}
        variant="standard"
        sx={{ input: { color: 'white'},'& label.Mui-focused': {
          color: '#A0AAB4',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#B2BAC2',
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#E0E3E7',
          },
          '&:hover fieldset': {
            borderColor: '#B2BAC2',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#6F7E8C',
          },
        }, }}>
      </TextField>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant='h1'>PumaTesis</Typography>
        <Typography variant='subtitle1'>El buscador de tesis más avanzado del mundo</Typography>
        <Buscador/>
      </header>
      
    </div>
  );
}

export default App;
