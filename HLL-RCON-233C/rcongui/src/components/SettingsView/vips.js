import React from "react";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Input,
  Button,
  Tooltip,
  Typography,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { ForwardCheckBox } from "../commonComponent";
import { get, handle_http_errors, showResponse } from "../../utils/fetchUtils";
import { result } from "lodash";

const AddVipItem = ({
  classes,
  name,
  setName,
  steamID64,
  setSteamID64,
  onAdd,
}) => (
  <ListItem>
    <Grid container>
      <Grid item xs={6} className={classes.paddingRight}>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>
      <Grid item xs={6} className={classes.paddingLeft}>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="SteamID64"
          value={steamID64}
          onChange={(e) => setSteamID64(e.target.value)}
        />
      </Grid>
    </Grid>
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() =>
          onAdd(name, steamID64).then(() => {
            setName("");
            setSteamID64("");
          })
        }
      >
        <AddIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

function setIntervalLimited(callback, interval, x) {

  for (var i = 0; i < x; i++) {
      setTimeout(callback, i * interval);
  }

}

const VipUpload = ({ classes }) => {
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);
  const [result, setResult] = React.useState(null);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append("File", selectedFile);

    fetch(`${process.env.REACT_APP_API_URL}async_upload_vips`, {
      method: "POST",
      body: formData,
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "include", // include, *same-origin, omit
    })
      .then(res => showResponse(res, "upload_vip", true)).then(res => !res.failed ? pollResult() : "")
      .catch(handle_http_errors)
    setIsFilePicked(false);

  };

  const getResult = () => get('async_upload_vips_result').then(res => showResponse(res, "async_upload_vips_result", false)).then(res => {setResult(JSON.stringify(res.result, null, 2)); console.log(res); })
  const pollResult = () => getResult() && setIntervalLimited(getResult, 2000, 500)

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Button
          fullWidth
          type="link"
          variant="outlined"
          href={`${process.env.REACT_APP_API_URL}download_vips`}
          target="_blank"
        >
          Download VIPs
        </Button>
      </Grid>
      <Grid item xs={6}>
        {isFilePicked ? (
          <Button fullWidth variant="contained" color="primary" onClick={handleSubmission}>submit</Button>
        ) : (
          <Tooltip title="Caution this does a total override, deletes all vip then re-add from file. The format is a simple text file (same as the downloaded one), one person per line with the steam id first then the name. eg: 76561198107873800 Thats my name">
            <Button fullWidth variant="outlined" component="label">
              Upload VIPs
              <input type="file" hidden onChange={changeHandler}/>
            </Button>
          </Tooltip>
        )}
      </Grid>
      {result ? 
      <Grid item xs={12}>
        <Typography variant="body2" color="secondary">The job may take a while, here's the current status, do not resubmit unless you see a "finished" or "failed" status: </Typography>
        <pre>
          {result}
        </pre>
      </Grid>
      : ""}
    </Grid>
  );
};

const VipEditableList = ({
  classes,
  peopleList,
  onDelete,
  onAdd,
  forward,
  onFowardChange,
}) => {
  const [name, setName] = React.useState("");
  const [steamID64, setSteamID64] = React.useState("");

  return (
    <React.Fragment>
      <List dense>
        <ForwardCheckBox bool={forward} onChange={onFowardChange} />
        <AddVipItem
          classes={classes}
          name={name}
          setName={setName}
          steamID64={steamID64}
          setSteamID64={setSteamID64}
          onAdd={onAdd}
        />
        {peopleList.map((obj) => (
          <ListItem key={obj.steam_id_64}>
            <ListItemText primary={obj.name} secondary={obj.steam_id_64} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDelete(obj.name, obj.steam_id_64)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <AddVipItem
          classes={classes}
          name={name}
          setName={setName}
          steamID64={steamID64}
          setSteamID64={setSteamID64}
          onAdd={onAdd}
        />
        <ForwardCheckBox bool={forward} onChange={onFowardChange} />
      </List>
    </React.Fragment>
  );
};

export default VipEditableList;
export { VipUpload };