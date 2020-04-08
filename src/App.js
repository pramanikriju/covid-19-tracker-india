import React, { useState, useEffect } from "react";
//import logo from "./logo.svg";
import "./App.css";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import LanguageIcon from "@material-ui/icons/Language";
import Map from "./Map";

import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const darkTheme = createMuiTheme({
  palette: {
    type: "light"
  }
});
const STATES_CODES = require("./IndianStates.json");

function App() {
  const classes = useStyles();
  const [active, setActive] = useState(false);
  const [cured, setCured] = useState(false);
  const [deaths, setDeaths] = useState(false);
  const [time, setTime] = useState(false);
  const [stateData, setStateData] = useState([]);

  useEffect(() => {
    let axios = require("axios");
    let cheerio = require("cheerio");
    axios.get("https://www.mohfw.gov.in/").then(
      response => {
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          let devtoList = [];
          $(".site-stats-count > ul > li").each(function(i, elem) {
            devtoList.push(
              $(this)
                .find("strong")
                .text()
                .trim()
            );
          });
          let time = $(".status-update h2 span").text();
          setActive(devtoList[0]);
          setCured(parseInt(devtoList[1]) + parseInt(devtoList[3]));
          setDeaths(devtoList[2]);
          setTime("Updated on :" + time.substring(7, 50));

          //Get Statewise Data
          //let stateData = [];
          //console.log($);

          $("table > tbody > tr").each((index, element) => {
            if (index === 0) return true;
            const tds = $(element).find("td");
            const state = $(tds[1]).text();
            const value = $(tds[2]).text();
            const id = STATES_CODES[state];
            const tableRow = { id, state, value };
            stateData.push(tableRow);
          });
          stateData.pop();
          stateData.pop();
          setStateData(stateData);
          console.log(stateData);
        }
      },
      error => console.log(error)
    );
  }, [stateData]);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            COVID-19 Tracker India
          </Typography>
          <Box mx={1} display={{ xs: "none", md: "block" }}>
            <Link href="https://github.com/pramanikriju/">
              <GitHubIcon style={{ color: "white" }} />
            </Link>
          </Box>
          <Box mx={1} display={{ xs: "none", md: "block" }}>
            <Link href="https://twitter.com/riju_venate">
              <TwitterIcon style={{ color: "white" }} />
            </Link>
          </Box>
          <Box mx={1} display={{ xs: "none", md: "block" }}>
            <Link href="https://www.facebook.com/riju.venation/">
              <FacebookIcon style={{ color: "white" }} />
            </Link>
          </Box>
          <Box mx={1} display={{ xs: "none", md: "block" }}>
            <Link href="https://riju.co" mx={15}>
              <LanguageIcon style={{ color: "white" }} />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <ThemeProvider theme={darkTheme}>
        <Paper elevation={0}>
          <Container>
            <Box mt={5}>
              <Grid container spacing={1}>
                <Grid xs={12} md={4} item>
                  <Card className={classes.root}>
                    <CardContent mt={10}>
                      <Typography
                        className={classes.title}
                        //color="textSecondary"
                        gutterBottom
                      >
                        Confirmed Cases
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        {active ? active : <CircularProgress />}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className={classes.root}>
                    <CardContent mt={10}>
                      <Typography
                        className={classes.title}
                        //color="textSecondary"
                        gutterBottom
                      >
                        Cured / Discharged / Migrated
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        {cured ? cured : <CircularProgress color="secondary" />}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card className={classes.root}>
                    <CardContent mt={10}>
                      <Typography
                        className={classes.title}
                        //color="textSecondary"
                        gutterBottom
                      >
                        Deaths
                      </Typography>
                      <Typography variant="h3" gutterBottom>
                        {deaths ? deaths : <CircularProgress color="inherit" />}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={3} bgcolor="background.paper">
                <Map data={stateData} />
              </Box>
              <Box mt={3} bgcolor="background.paper">
                <Grid
                  justify="space-between" // Add it here :)
                  container
                  spacing={5}
                >
                  <Grid item>
                    <Typography mt={20} variant="subtitle2" gutterBottom>
                      {time ? time : "NA"}
                    </Typography>
                    <Typography mt={20} variant="subtitle2" gutterBottom>
                      Made by <Link href="https://riju.co">Riju Pramanik</Link>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box mx={1}>
                      <Link href="https://www.mohfw.gov.in/">
                        <Button variant="contained" color="primary">
                          Source : MoHFW
                        </Button>
                      </Link>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Paper>
      </ThemeProvider>
    </div>
  );
}

export default App;
