import React, { Component } from "react";
import SwimLaneTitle from "./SwimLaneTitle.jsx";
import Swimmer from "./Swimmer.jsx";

// Material UI Items
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

// Custom styling for material components
const styles = theme => ({
  // Grid adjustments
  widthFix: {
    [theme.breakpoints.up("lg")]: {
      flexBasis: 0,
      flexGrow: 1,
      marginRight: theme.spacing.unit * 3
    },
    [theme.breakpoints.down("md")]: {
      whiteSpace: "nowrap",
      overflowX: "scroll",
      width: "100%",
      padding: theme.spacing.unit * 2
    }
  },
  [theme.breakpoints.up("lg")]: {
    noMargin: {
      marginRight: "0px"
    }
  }
});

class Swimlanes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      swimmers: [],
    };
  }

  // This component should never update after being loaded
  shouldComponentUpdate(nextState) {
    return false;
  }

  render() {
    const { classes } = this.props;
    const theSwimmers = this.props.swimmers; // The data, inherited from app.js calls to the server

    // Setup our object to handle the different categories
    let swimmerGroup = {
      General: "",
      Security: "",
      Accessibility: "",
      SEO: "",
      UX: ""
    };

    if (theSwimmers.length > 0) {
      Object.keys(swimmerGroup).forEach(key => {
        swimmerGroup[key] = theSwimmers
          .filter(swimmer => swimmer.category === key) // For each category
          .map((swimmer, index) => { // Map the data to the correct category (key)
            return (
              <Swimmer
                key={index}
                index={index}
                swimmer={swimmer}
                progress={this.props.progress}
                hash={this.props.hash}
                error={this.props.error}
              />
            );
          });
      });
    }

    return (
      <React.Fragment>
        <Grid className={`${classes.widthFix}`}>
          <SwimLaneTitle category="General" />
          {swimmerGroup["General"]}
        </Grid>
        <Grid className={`${classes.widthFix}`}>
          <SwimLaneTitle category="Security" />
          {swimmerGroup["Security"]}
        </Grid>
        <Grid className={`${classes.widthFix}`}>
          <SwimLaneTitle category="Accessibility" />
          {swimmerGroup["Accessibility"]}
        </Grid>
        <Grid className={`${classes.widthFix}`}>
          <SwimLaneTitle category="SEO" />
          {swimmerGroup["SEO"]}
        </Grid>
        <Grid className={`${classes.widthFix} ${classes.noMargin}`}>
          <SwimLaneTitle category="UX" />
          {swimmerGroup["UX"]}
        </Grid>
      </React.Fragment>
    );
  }
}

Swimlanes.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Swimlanes);