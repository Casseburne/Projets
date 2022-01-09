import React from "react";
import {Grid, Link, Typography} from "@material-ui/core";
import {get as apiGet, handle_http_errors, showResponse,} from "../../utils/fetchUtils";

const Footer = ({ classes }) => {
  const [repoData, setRepoData] = React.useState([]);
  const [apiVersion, setApiVersion] = React.useState("N/A");

  React.useEffect(() => {
    fetch("https://api.github.com/repos/MarechJ/hll_rcon_tool/contributors")
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else {
          throw new Error("rate limited")
        }
      })
      .then((data) => setRepoData(data)).catch(() => null);
    apiGet("get_version")
      .then((res) => showResponse(res, "get_version", false))
      .then((data) => setApiVersion(data.result))
      .catch(handle_http_errors);
  }, []);

  return (
    <Grid container>
      <Grid item className={classes.paddingTop} xs={12}>
        <Typography
          color="textSecondary"
          variant="caption"
          display="block"
          gutterBottom
        >
          UI Version: {process.env.REACT_APP_VERSION} API Version: {apiVersion}{" "}
          - Brought to you by Dr.WeeD,{" "}
          {repoData
            .filter((d) => d.type === "User")
            .map((d) => (
              <Link key={d.login} target="_blank" href={d.html_url}>
                {`${d.login} (${d.contributions})`},{" "}
              </Link>
            ))}
        </Typography>
      </Grid>
      {!process.env.REACT_APP_PUBLIC_BUILD ?
      <Grid item xs={12}>
        <Typography
          color="textSecondary"
          variant="caption"
          display="block"
          gutterBottom
        >
          Rejoignez{" "}
          <Link target="_blank" href="https://discord.gg/233C">
            le discord
          </Link>{" "}
          pour participer aux events.
        </Typography>
      </Grid> : ""}
    </Grid>
  );
};

export default Footer;
