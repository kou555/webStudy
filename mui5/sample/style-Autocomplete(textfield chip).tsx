import * as React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { height } from '@mui/system';
import { makeStyles, withStyles } from  '@mui/styles';
import { ThemeProvider, createTheme } from  '@mui/material/styles';
import theme from  './theme';
import Popper from '@mui/material/Popper';

import styles from "/styles/CustomTag.module.css";


// import theme from  '../themes/theme';

// //style
// root: {
//   "& .MuiAutocomplete-listbox": {
//     border: "2px solid grey",
//     minHeight: 400,
//     color: "green",
//     fontSize: 18,
//     //hover discussed above
//     "& li": {
//       //list item specific styling
//       border: "2px solid green",
//       borderRadius: 4
//     }
//   }
// }

const useStyles3 = makeStyles({
  root: {
    "& .MuiAutocomplete-root": {
      border: "2px solid grey",
      minHeight: 1400,
      color: "green",
      fontSize: 18,
      // backgroundColor: '#fff',
      background: '#000',
      // background-color: '#fff',
      "& :hover": {
        color: "brown"
      },
      "& li": {
        //list item specific styling
        border: "2px solid green",
        borderRadius: 4
      }
    },
    "& .MuiInputBase-colorPrimary": {
      background: '#fff',
    }
  },
  // textfield: {
  //   "& .MuiInputBase-input.MuiAutocomplete-input": {
  //     //background: '#fff',
  //     color: "blue",
  //     fontSize: 18
  //   },
  //   "& #custom-autocomplete-label": {
  //     //or could be targeted through a class
  //     background: '#fff',
  //     color: "brown"
  //   },
  //   "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
  //     color: "blue",
  //     background: '#fff',
  //   }
  // }
});

type props = {
  wordsList:string[],
  setWordsList(wordsList: string[]):void,
  editModeFlg:boolean
}


export default function WordsInput(props : props) {
  // const  classes  =  useStyles();
  const classes3 = useStyles3();

  // 親へ値を渡す
  function handleInputChange(event:any, value:any) {
    console.log("in on change:", value);
    props.setWordsList(value as string[]);
  }

  console.log("props in wordsInput:", props);

  return (
    <ThemeProvider  theme={theme}>
    <Stack spacing={3}>
      <Autocomplete
        multiple
        id="words-filled"
        options={[]}
        defaultValue={props.wordsList}
        freeSolo
        readOnly={props.editModeFlg}
        onChange={handleInputChange}
        
        style={{border: "2px solid #c6c1ba",  height:300, width:700, backgroundColor: "#fff"}}
        //className={classes.boxContainer}
        // sx={{ bgcolor: '#fff'}}
        // sx={{ background-color: '#fff'}}
        // PaperComponent={CustomPopper}
        className={classes3.root}
        // PaperComponent={CustomAutocomplete}
        renderTags={(tagList: readonly string[], getTagProps) =>
          {
            //console.log(tagList);
            //props.setWordsList(tagList as string[]);
            return tagList.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ));
          }
        }
        renderInput={(params) => {
          // console.log('params', {...params});
          return (
           <TextField
             {...params}
             variant="filled"
             placeholder="ここにワードを入力"
           //style={{ paddingLeft: 20, backgroundColor: "#fff"}}
           ///sx={{ bgcolor: '#fff'}}
          //  className={classes3.textfield}
          //  className={styles.wordsInputText}
           //style={{ paddingLeft: 20, border: "2px solid black",  backgroundColor: "yellow"}}
           // style={{ paddingLeft: 20, border: "2px solid black", backgroundColor:"#FFFFFF"}}
            //sx={{ height: 400 }}
            // label="freeSolo"
          />
        )}}
      />
      {/* <Autocomplete
        multiple
        id="tags-readOnly"
        options={top100Films.map((option) => option.title)}
        defaultValue={[top100Films[12].title, top100Films[13].title]}
        readOnly
        renderInput={(params) => (
          <TextField {...params} label="readOnly" placeholder="Favorites" />
        )}
      /> */}
    </Stack>
    </ThemeProvider>
  );
}

// // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// const top100Films = [
//   { title: 'The Shawshank Redemption', year: 1994 },
//   { title: 'The Godfather', year: 1972 },
//   { title: 'The Godfather: Part II', year: 1974 },
// ];
