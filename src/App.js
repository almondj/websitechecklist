import React from "react";
import "./index.css";
import PoolBanner from "./PoolBanner";
import Swimlanes from "./Swimlanes";
import jsondata from "./data/convertcsv.json";
import axios from "axios";
import Error from "./Error.jsx";

// Material UI Items
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "typeface-roboto";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import grey from "@material-ui/core/colors/grey";

// Custom styling for components
const styles = theme => ({
  appBarShift: {
    marginTop: "56px",
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
    [theme.breakpoints.up("lg")]: {
      flexWrap: "nowrap",
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  },
  root: {
    flexGrow: 1
  },
  // Specific to app initialization, allows circular progress to sit center page
  load: {
    width: "100vw",
    height: "100vh"
  },
  // Specific to the linear determinate progress bar when saving to the server
  position: {
    position: "fixed",
    top: "60px",
    left: "auto",
    right: "0",
    width: "100%",
    zIndex: "1101",
    animation:
      "scale-up-ver-bottom 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) .8s both",
    height: "4px",
    [theme.breakpoints.only("xs")]: {
      top: "52px"
    }
  },
  footer: {
    margin: theme.spacing(4) + 'px ' + theme.spacing(3) + 'px',
    textAlign: 'center',
    color: grey[900],
  }
});

class AutoGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // Initializing: true, ready to go: false
      completed: 0, // Determinate progress value: 0 (unseen), > 0 (progress visibly shown)
      error: false // Error window: false (no error shown), true (error shown)
    };
  }

  // For optimization, the app as a whole should only change when the app is loaded
  shouldComponentUpdate(nextState) {
    if (this.state.loading !== nextState.loading) {
      return true;
    }
    return false;
  }

  // Gathering the data to be used,
  // IF the existingProject is set: load from server
  // ELSE: local data is used (no DB calls, for speed)
  componentDidMount() {

    // Managing the load animation status
    // Circular progress animation will disappear after 2 seconds
    setTimeout(
      () =>
        this.setState(
          { loading: false },
          document.getElementById("root").focus()
        ),
      2000
    );

    if (window.existingProject === true) {
      // Set in PHP for speed
      console.log("existing project");
      axios
        .get("../fetch.php?hash=" + getHash()) // JSON data from server
        .then(response => {
          // jsondata: default data built into the app (imported above), response.data: data from the server
          response.data.length === 0
            ? this.setState({ swimmers: jsondata })
            : this.setState({ swimmers: response.data });
        })
        .catch(function(error) {
          console.log(error);
          this.error(); // Show error window
        });
    } else {
      console.log("local build or new project");
      this.setState({
        swimmers: jsondata
      });
    }
  }

  // Handle determinate progress bar
  progress = () => {
    let status = this;

    // Recall this every 400ms
    // TODO: This method is from the docs, but really a clunky way of doing things, breaks occassionally on mobile
    let timer = setInterval(function() {
      const { completed } = status.state;

      // IF completed is over 100: stop the loop (clearInterval) and reset the progress bar (completed: 0)
      // ELSEIF completed is 0: show the beginnings of the progress bar (completed: 1)
      // ELSE: increment the progress bar till it disappears
      if (completed > 100) { 
        status.setState({ completed: 0 });
        clearInterval(timer);
      } else if (completed === 0) {
        status.setState({ completed: 1 });
      } else {
        status.setState({ completed: completed + 99 });
      }
    }, 400);
  };

  // Show the error window (no custom messaging avail)
  error = () => {
    this.setState({ error: true });
  };

  // Close the error window
  closeError = () => {
    this.setState({ error: false });
  };

  render() {
    const { classes } = this.props;
    let loading = this.state.loading;

    if (loading) {
      // This shows on page load
      return (
        <React.Fragment>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.load}
          >
            <CircularProgress aria-label="Loading" />
          </Grid>
        </React.Fragment>
      );
    }

    // Actual app renders here after load
    return (
      <React.Fragment>
        {this.state.error ? (
          <Error open={this.state.error} close={this.closeError} />
        ) : (
          ""
        )}
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              {this.state.swimmers
                .filter(swimmer => swimmer.category === "properties")
                .map((swimmer, index) => (
                  <PoolBanner
                    key={index}
                    url={swimmer.note}
                    hash={getHash()}
                    progress={this.progress}
                    error={this.error}
                  />
                ))}
            </Grid>
          </Toolbar>
        </AppBar>
        {this.state.completed > 0 ? (
          <LinearProgress
            className={classes.position}
            variant="determinate"
            color="secondary"
            value={this.state.completed}
          />
        ) : (
          ""
        )}
        <div className={classes.root}>
          <Grid container spacing={3} className={classes.appBarShift}>
            <Swimlanes
              swimmers={this.state.swimmers}
              progress={this.progress}
              hash={getHash()}
              error={this.error}
            />
          </Grid>
        </div>
        <footer className={classes.footer}>
          <p>React built in 2020. Questions or comments? Please <a className="anchor" href="mailto:feedback@websitelaunchchecklist.net" target="_blank" rel="noopener noreferrer">send your feedback!</a></p>
        </footer>
      </React.Fragment>
    );
  }
}

// Get the hash value for DB calls later, originally set in PHP for speed
function getHash() {
  return window.currentHash;
}

AutoGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AutoGrid);