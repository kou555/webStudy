import type { NextPage, GetServerSideProps } from "next";
import * as React from "react";
import {Router, useRouter} from "next/router";
import axios from "axios";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import {
  Props,
  getCustomTagInfo,
  getAllHelpDeskList,
  getBelongToAndUnaffiliatedList,
  intersection,
  not,
} from "./showLogic";

import { CustomTagList } from "../../pageList";
import WordsInput from "./WordsInput";
import styles from "/styles/CustomTag.module.css";

// SSRで一覧の初期表示を取得
export const getServerSideProps: GetServerSideProps = async (context) => {
  const props: Props = {
    CustomTagInfo: {},
    HelpDeskList: [],
    CustomWordList: [],
    belongToList: [],
    unaffiliatedList: [],
    allHelpDeskList:[]
  };
  
  // タグ情報取得
  const resData = await getCustomTagInfo( {customDictId: context.query.id as string});
  console.log(resData);
  props.CustomTagInfo = resData.CustomTagInfo;
  props.HelpDeskList = resData.HelpDeskList;
  props.CustomWordList = resData.CustomWordList;
  props.allHelpDeskList = await getAllHelpDeskList();
  ({'belongToList': props.belongToList, 'unaffiliatedList': props.unaffiliatedList} = getBelongToAndUnaffiliatedList(resData.HelpDeskList, props.allHelpDeskList));

  // console.log("★unaffiliatedList", props.belongToList);
  // console.log("★unaffiliatedList", props.unaffiliatedList);

  return {
    props: props,
  };
}


/**
 * メイン処理
 * @param props 
 * @returns 
 */
const Show: NextPage<Props> = (props:Props) => {

  {/* Router */}
  const router = useRouter();

  {/* State */}
  const [customTagInfo, setCustomTagInfo] = React.useState(props.CustomTagInfo);
  const [helpDeskList, setHelpDeskList] = React.useState<[]>(props.HelpDeskList);
  
  // 所属済み
  const [leftList, setLeftList] = React.useState<Object[]>(props.belongToList);
  const [rightList, setRightList] = React.useState<Object[]>(props.unaffiliatedList);
  const [checkedList, setCheckedList] = React.useState<readonly Object[]>([]);
  const [searchWordRight, setSearchWordRight] = React.useState("");
  const [searchWordLeft, setSearchWordLeft] = React.useState("");
  const [editModeFlg, setEditModeFlg] = React.useState(false)

  const [confirmDiaOpenFlg, setConfirmDiaOpenFlg] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState({
    open: false,
    message: "エラーが発生しました。もう一度お試しください。"
  });

  // const [affiliationCounter, setAffiliationCounter] = React.useState(router.query.affiliationCounter);
  // const [value, setValue] = React.useState();
  // const [helpDesk, setHelpDesk] = React.useState(props.helpDesk);
  // const [roleList, setRole] = React.useState(props.role);
  // const [deleteOpen, setDeleteOpen] = React.useState(false);
  // const inputRefName = React.useRef(null);
  // const [inputErrorName, setInputErrorName] = React.useState(false);
  // const [inputErrorRole, setInputErrorRole] = React.useState(false);
  // const [validEmailTxt, setValidEmailTxt] = React.useState("指定されている形式で入力してください。")

  const leftCheckedList: Object[] = intersection(checkedList, leftList);
  const rightCheckedList: Object[] = intersection(checkedList, rightList);
  // ワードリスト初期化
  let customWordList = props.CustomWordList.map((item:{word:string}) : string=>{return item.word;});

  // const [selectValue, setSelect] = React.useState(userRole);

  // const handleChange = (event: SelectChangeEvent) => {
  //   setSelect(event.target.value as string);
  // };






  function kanaToHira(str:string) :string {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
  }

 // *************** ボタンイベント **************//

  const handleClose = () => {
    switchToViewMode()
    setConfirmDiaOpenFlg(false);
  };

  const handleErrorClose = () => {
    setErrorOpen({
      open: false,
      message: "エラーが発生しました。もう一度お試しください。"
    });
  };

  const switchToViewMode = () => {

    // 入力欄を初期値に戻す
    setLeftList(props.belongToList);
    setRightList(props.unaffiliatedList);
    // setSelect(userRole);
    setCheckedList([]);

    // 閲覧モードに切り替え
    setEditModeFlg(false)
    return
  }

   const onClickSave = async () => {

    const refMail = inputRefMail.current;
    // メールアドレスのバリデーション
    let isBlank = false
    if (refMail.value === "") {
      setValidEmailTxt("必須入力項目です。メールアドレスを入力してください。")
      setInputErrorEmail(true);
      isBlank = true
    } else if(!refMail.validity.valid || mail === "") {
      setValidEmailTxt("指定されている形式で入力してください。")
      setInputErrorEmail(true);
      isBlank = true
    } else {
      setInputErrorEmail(false);
    }
    // 権限のバリデーション
    if (selectValue === ""){
      setInputErrorRole(true);
      isBlank = true
    } else {
      setInputErrorRole(false);
    }

    if (isBlank) return

    const helpDeskList = varidateHelpDesk()
    const roleId = selectValue.substr(selectValue.indexOf('.') + 1)
    const params = {
      id: userInfo.id,
      userName: userInfo.name,
      mailAddress: mail,
      roleId: parseInt(roleId),
      helpDesk: helpDeskList,
    }

    try {
      const response = await axios.post("/api/UserMgt/put", params);
      const data = response.data;
      setUserInfo(data.message);

      router.push({
        pathname: UserMgtList.index,
      });

    } catch (err) {
      console.log(err);
      setErrorOpen({
        open: true,
        message: "エラーが発生しました。もう一度お試しください。"
      })
    }
  }

  const handleClickDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };



  const varidateHelpDesk = () => {
    const listTmp = []

    for(const helpDesk of left){
      listTmp.push(helpDesk.ID)
    }
    return listTmp
  }

  const onClickDelete = async () => {
    const params = {
      id: `User.${router.query.id}`,
    }

    try {
      const response = await axios.post("/api/UserMgt/delete", params);
      const data = response.data;
    } catch (err) {
      console.log(err);
    }

    router.push({
      pathname: UserMgtList.index,
      // query: { id: id },
    });
    setDeleteOpen(false);
  }
  const mailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMail(event.target.value);
  };

  
  // *************** ワードコンポーネントハンドラーなど **************//
  // ワードリスト設定
  function setCustomWordList(wordsList:string[]) {
    customWordList = wordsList;
    console.log("oya:", wordsList);
  }

  // *************** 所属コンポーネントハンドラーなど **************//
  // onClick(所属リストitem)
  const handleToggle = (targetObj: Object) => () => {
    const currentIndex = checkedList.indexOf(targetObj);
    const newCheckedList = [...checkedList];

    if (currentIndex === -1) {
      newCheckedList.push(targetObj);
    } else {
      newCheckedList.splice(currentIndex, 1);
    }
    setCheckedList(newCheckedList);
  };

  // 所属リストコンテンツの設定
  const setHelpDeskContent = (items: readonly {}[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {items.map((value: {}, index: number) => {
          const labelId = `transfer-list-item-${value}-label`;

          return (
            <ListItem
              key={index}
              role="listitem"
              button
              onClick={handleToggle(value)}
              disabled={!editModeFlg}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checkedList.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.HelpDeskName}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Paper>
  );

  // *************** 所属コンポーネントイベント **************//
  // onclick(右アローマーク)
  const handleClickRightArrow = () => {
    setRightList(rightList.concat(leftCheckedList));
    setLeftList(not(leftList, leftCheckedList));
    setCheckedList(not(checkedList, leftCheckedList));
  };

  // onclick(左アローマーク)
  const handleClickLeftArrow = () => {
    setLeftList(leftList.concat(rightCheckedList));
    setRightList(not(rightList, rightCheckedList));
    setCheckedList(not(checkedList, rightCheckedList));
  };

  // 所属の右テキストボックスのonchangeイベント
  const onChangeRightInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWordRight(event.target.value)
  };

  // 所属の右テキストボックスのonchangeイベントにおいて、リストを設定し直す
  const onChangeRightRecord = (word:string) => (
    <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {rightList.map((value: object, index: number) => {
          const labelId = `transfer-list-item-${value}-label`;
          const regex = new RegExp(kanaToHira(word));
            if (regex.test(kanaToHira(value.HelpDeskName))) {
              return (
                <ListItem
                  key={index}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checkedList.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value.HelpDeskName}`} />
                </ListItem>
              );
            }
        })}
        <ListItem />
      </List>
    </Paper>
  )

  // 所属の左テキストボックスのonchangeイベント
  const onChangeLeftInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWordLeft(event.target.value)
  };

  // 所属の左テキストボックスのonchangeイベントにおいて、リストを設定し直す
  const onChangeLeftRecord = (word:string) => (
    <Paper sx={{ width: 200, height: 230, overflow: "auto" }}>
      <List dense component="div" role="list">
        {leftList.map((value: object, index: number) => {
          const labelId = `transfer-list-item-${value}-label`;
          const regex = new RegExp(kanaToHira(word));
            if (regex.test(kanaToHira(value.HelpDeskName))) {
              return (
                <ListItem
                  key={index}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checkedList.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={`${value.HelpDeskName}`} />
                </ListItem>
              );
            }
        })}
        <ListItem />
      </List>
    </Paper>
  )

  return (
    <div>
      <Box className={styles.box}>
        <Grid container>
          <h3 className={styles.subTitle}>タグ名</h3>
          <TextField
            id="outlined-basic"
            variant="outlined"
            // sx={{ m: 1, minWidth: 250, border: '3px solid grey'}}
            size="small"
            value={customTagInfo.CustomDictName}
            disabled
            sx={{ m: 1, "& .MuiOutlinedInput-root":{"& > fieldset": {border: '3px solid grey', borderRadius:'0px'}}}}
            //fullWidth
            // InputProps={{
            //   classes: {
            //     notchedOutline: classes['input-border'],
            //   },
            // }}
          />
        </Grid>

        <Grid container>
          <h3 className={styles.subTitle}>ワード</h3>
          <WordsInput wordsList ={customWordList} setWordsList={setCustomWordList} editModeFlg={!editModeFlg}/>
        </Grid>

        <Grid container className={styles.affiliationCounter}>
          <Grid>
            <h3 className={styles.subTitle}>所属窓口</h3>
          </Grid>
          <Grid className={styles.listBox}>
            <p className={styles.listTitleLeft}>所属済み({leftList.length})</p>
            <Input
              id="input-with-icon-adornment"
              endAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              className={styles.affiliationCounterSearh}
              onChange={onChangeLeftInput}
              value={searchWordLeft}
              disabled={!editModeFlg}
            />
            {searchWordLeft ? <Grid item>{onChangeLeftRecord(searchWordLeft)}</Grid> 
                              : <Grid item>{setHelpDeskContent(leftList)}</Grid>}
          </Grid>
          <Grid>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleClickRightArrow}
                disabled={leftCheckedList.length === 0}
                aria-label="move selected right"
              >
                &gt;
              </Button>
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleClickLeftArrow}
                disabled={rightCheckedList.length === 0}
                aria-label="move selected left"
              >
                &lt;
              </Button>
            </Grid>
          </Grid>
          <Grid className={styles.listBox}>
            <p className={styles.listTitleRight}>未所属({rightList.length})</p>
            <Input
              id="input-with-icon-adornment"
              endAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              className={styles.affiliationCounterSearh}
              onChange={onChangeRightInput}
              value={searchWordRight}
              disabled={!editModeFlg}
            />
            {searchWordRight !== "" ? <Grid item>{onChangeRightRecord(searchWordRight)}</Grid> 
                              : <Grid item>{setHelpDeskContent(rightList)}</Grid>}
          </Grid>
        </Grid>
      </Box>

      <Grid className={styles.btnsField}>
        <Button 
          variant="contained" 
          className={styles.backBtn}
          onClick={() => {
            if (editModeFlg) {
              // 編集モードOFF
              setConfirmDiaOpenFlg(true)
            } else {
              router.push(UserMgtList.index)
            }
          }}
        >
          { editModeFlg ? "キャンセル" : "戻る" }
        </Button>
        <Button
          variant="contained" 
          className={styles.saveBtn}
          onClick={() => {
            if (editModeFlg) {
              // 保存ボタン押下時
              onClickSave()
            } else {
              // 編集モードON
              setEditModeFlg(true)
            }
          }}
        >
          { editModeFlg ? "保存" : "編集" }
        </Button>
          
        <Button 
          variant="contained"
          className={styles.deleteBtn}
          onClick={handleClickDeleteOpen}
        >
          削除
        </Button>
        <Dialog
          // open={deleteOpen}
          open={false}
          // onClose={handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {/* {userInfo.name}を削除しますか？ */}
          </DialogTitle>
          <DialogActions>
            {/* <Button onClick={handleDeleteClose}>いいえ</Button>
            <Button onClick={() => onClickDelete()} autoFocus>
              はい
            </Button> */}
          </DialogActions>
        </Dialog>
        {/* 確認ダイアログ */}
        <Dialog
          open={confirmDiaOpenFlg}
          onClose={()=>{setConfirmDiaOpenFlg(false)}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            入力状況が破棄されますがよろしいですか？
          </DialogTitle>
          <DialogActions>
            <Button onClick={()=>{setConfirmDiaOpenFlg(false)}}>いいえ</Button>
            <Button onClick={handleClose}>はい</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={errorOpen.open}
          // onClose={handleErrorClose}
          // aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {/* {errorOpen.message} */}
          </DialogTitle>
          <DialogActions>
            {/* <Button onClick={handleErrorClose}>確認</Button> */}
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  );
};

export default Show;
