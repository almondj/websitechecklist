import React, { Component } from "react";
import axios from "axios";
import SwimmerTag from "./SwimmerTag.jsx";

// Material UI Items
import Paper from "@material-ui/core/Paper";
import Delete from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import grey from "@material-ui/core/colors/grey";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";

const styles = theme => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.textSecondary,
    borderTop: "3px solid transparent",
    display: "inline-block",
    width: "calc(100vw - " + theme.spacing(5) + "px)",
    maxWidth: "360px",
    verticalAlign: "top",
    whiteSpace: "normal",
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      maxWidth: "280px"
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
      maxWidth: "none",
      marginBottom: theme.spacing(2),
      marginRight: "0px"
    }
  },
  // This updates the look of the completed swimmers
  completed: {
    backgroundColor: grey[200],
  },
  borderRed: {
    borderColor: red[500]
  },
  borderGreen: {
    borderColor: green[500]
  },
  borderBlue: {
    borderColor: blue[500]
  },
  borderOrange: {
    borderColor: orange[500]
  },
  borderPurple: {
    borderColor: purple[500]
  },
  button: {
    marginRight: theme.spacing(2)
  },
  // Link style, there seems to be nothing in material ui library for links
  anchor: {
    color: blue[500],
    fontWeight: "medium"
  }
});

// Specific to swimmer title to match material design specs
const titleWeight = createMuiTheme({
  typography: {
    fontSize: 16
  }
});

class Swimmer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.swimmer.id,
      completed: this.props.swimmer.completed.toLowerCase(),
      category: this.props.swimmer.category,
      title: this.props.swimmer.title,
      note: this.props.swimmer.note,
      visible: this.props.swimmer.visible.toLowerCase(),
      description: this.props.swimmer.description,
      swimmer: this.props.swimmer.swimmer,
      hash: this.props.hash
    };
  }

  // Should only update if deletion or completion occurs
  shouldComponentUpdate(nextState) {
    if (
      this.state.completed !== nextState.completed ||
      this.state.visible !== nextState.visible
    ) {
      return true;
    }
    return false;
  }

  handleCompletion(event) {
    let completeStatus =
      this.state.completed.toLowerCase() === "false" ? "true" : "false"; // prepping for values coming out of the DB

    // Update completion status in the DB
    let status = this;
    var params = new URLSearchParams();
    params.append("hash", this.state.hash);
    params.append("swimmer", this.state.swimmer);
    params.append("part", "completed");
    params.append("val", completeStatus);
    axios
      .post("../update.php", params)
      .then(function(response) {
        console.log("done", response);
        // show a determinate loader
        // https://codesandbox.io/s/50kypzl4wk
        status.props.progress();
        // Set/show the completion status
        status.setState({ completed: completeStatus });
      })
      .catch(function(error) {
        // Show an error window
        console.log(error);
        status.props.error();
      });
  }

  handleRemove(event) {
    let visibleStatus =
      this.state.visible.toLowerCase() === "true" ? "false" : "true"; // prepping for values coming out of the DB

    // Remove item status in DB
    var params = new URLSearchParams();
    let status = this;
    params.append("hash", this.state.hash);
    params.append("swimmer", this.state.swimmer);
    params.append("part", "visible");
    params.append("val", visibleStatus);
    axios
      .post("../update.php", params)
      .then(function(response) {
        console.log("done", response);
        // Set the visibility
        status.setState({ visible: visibleStatus });
        // show a determinate loader
        // https://codesandbox.io/s/50kypzl4wk
        status.props.progress();
      })
      .catch(function(error) {
        // Show an error window
        console.log(error);
        status.props.error();
      });
  }

  render() {
    const { classes } = this.props;

    // Prepare for completion, these are defaults
    let title = this.props.swimmer.title;
    let buttonStyle = "primary";
    let bgColor = borderColor(
              this.state.category,
              classes);
    let buttonText = "Complete";

    // Swimmer completed, adjust look
    if (this.state.completed.toLowerCase() === "true") {
      title = <s>{title}</s>;
      buttonStyle = "default";
      bgColor = classes.completed;
      buttonText = "Completed";
    }

    if (this.state.visible.toLowerCase() === "true") {
      return (
        <React.Fragment>
          <Paper
            className={`${classes.paper} ${bgColor}`}
          >
            <MuiThemeProvider theme={titleWeight}>
              <Typography>{title}</Typography>
            </MuiThemeProvider>
            <p dangerouslySetInnerHTML={createMarkup(this.state.description)} />
            <SwimmerTag
              hash={this.state.hash}
              swimmer={this.state.swimmer}
              value={this.state.note}
              progress={this.props.progress}
              error={this.props.error}
            />
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <IconButton
                color="inherit"
                className={classes.button}
                aria-label="Delete"
                title="Delete"
                onClick={e => this.handleRemove(e)}
              >
                <Delete
                  className={classes.iconButton}
                  aria-hidden="true"
                  color="action"
                />
              </IconButton>
              <Button
                onClick={e => this.handleCompletion(e)}
                variant="contained"
                color={buttonStyle}
              >
                {buttonText}
              </Button>
            </Grid>
          </Paper>
        </React.Fragment>
      );
    } else {
      // Submerged (hidden) swimmers
      return null;
    }
  }
}

// Determine color of swimmer's cap
function borderColor(category, classes) {
  switch (category) {
    case "Security":
      return classes.borderBlue;
    case "Accessibility":
      return classes.borderGreen;
    case "SEO":
      return classes.borderOrange;
    case "UX":
      return classes.borderPurple;
    default:
      return classes.borderRed;
  }
}

// In order to render the swimmer description links as actual links
function createMarkup(encodedHTML) {
  return { __html: encodedHTML };
}

Swimmer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Swimmer);