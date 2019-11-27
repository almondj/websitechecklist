import React, { Component } from "react";
import axios from "axios";
//import Error from "./Error.jsx";

// Material UI Items
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import InsertLink from "@material-ui/icons/InsertLink";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputBase from "@material-ui/core/InputBase";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  // Center the title visually
  title: {
    lineHeight: theme.spacing(7) + "px"
  },
  fieldWrap: {
    [theme.breakpoints.up("sm")]: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginLeft: 0,
      width: "auto",
      alignSelf: "center"
    }
  },
  urlIcon: {
    [theme.breakpoints.up("sm")]: {
      lineHeight: theme.spacing(7) + "px",
      padding: 0,
      height: "100%",
      position: "absolute",
      top: "2px",
      left: theme.spacing(2) + "px",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    [theme.breakpoints.only("xs")]: {
      padding: theme.spacing + "px"
    }
  },
  inputRoot: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex",
      color: "inherit",
      width: "100%"
    }
  },
  inputInput: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      paddingTop: theme.spacing + "px",
      paddingRight: theme.spacing + "px",
      paddingBottom: theme.spacing + "px",
      paddingLeft: theme.spacing(7) + "px",
      transition: theme.transitions.create("width"),
      width: "auto",
      "&:focus": {
        width: 230
      }
    }
  },
  logoLink: {
    color: 'white',
    textDecoration: 'none',
    "&:hover, &:active": {
      textDecoration: 'underline',
    },
  },
});

class PoolBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.url,
      hash: this.props.hash,
      open: false,
      error: false,
    };
  }

  // Mobile only, opens a dialog to adjust project
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  // Mobile only, closes the dialog to adjust project
  handleClose = () => {
    this.setState({ open: false });
    this.handleSave();
  };

  // Update the state of the url (project)
  handleUrl(noteVal) {
    this.setState({
      url: noteVal
    });
  }

  // Send the updated project name/url to the server
  handleSave() {
    // Update URL for project
    let status = this;
    var params = new URLSearchParams();
    params.append("hash", this.state.hash);
    params.append("swimmer", "zTiJYQ1ErI");
    params.append("part", "note");
    params.append("val", this.state.url);
    axios
      .post("../update.php", params)
      .then(function(response) {
        console.log("done", response);
        // show a determinate loader
        // https://codesandbox.io/s/50kypzl4wk
        status.props.progress();
      })
      .catch(function(error) {
        // Show an error pop-up
        console.log(error);
        status.props.error();
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography variant="h6" color="inherit" className={classes.title} variantMapping={{title: 'h1'}}>
          <a href="../" className={classes.logoLink}>Website Launch Checklist</a>
        </Typography>
        <div className={classes.fieldWrap}>
          <IconButton
            color="inherit"
            className={classes.urlIcon}
            onClick={this.handleClickOpen}
            aria-label="Website URL"
            id="urlIcon"
          >
            <InsertLink />
          </IconButton>
          <InputBase
            margin="dense"
            id="name2"
            onChange={e => this.handleUrl(e.target.value)}
            onBlur={e => this.handleSave(e.target.value)}
            value={this.state.url}
            type="url"
            inputProps={{ "aria-labelledby": "urlIcon", maxLength: "500" }}
            placeholder="http://"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
          />
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Project URL</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Website URL"
              onChange={e => this.handleUrl(e.target.value)}
              value={this.state.url}
              type="url"
              placeholder="http://"
              fullWidth
              ref={this.textInput}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Save and Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

PoolBanner.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PoolBanner);