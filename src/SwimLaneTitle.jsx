import React, { Component } from "react";

// Material UI Items
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AccessibilityNew from "@material-ui/icons/AccessibilityNew";
import Build from "@material-ui/icons/Build";
import Button from '@material-ui/core/Button';
import Search from "@material-ui/icons/Search";
import Lock from "@material-ui/icons/Lock";
import InvertColors from "@material-ui/icons/InvertColors";
import Paper from '@material-ui/core/Paper';
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import orange from "@material-ui/core/colors/orange";
import purple from "@material-ui/core/colors/purple";

const styles = theme => ({
	catIcon: {
		position: "relative",
		top: "5px"
	},
	catTitle: {
		textAlign: "center",
		position: "sticky",
		left: 0,
		marginTop: 0,
		[theme.breakpoints.up("sm")]: {
			marginTop: theme.spacing(4) + "px"
		}
	},
	catPaper: {
		padding: theme.spacing(1) + "px",
		textAlign: "center",
		marginRight: theme.spacing(2),
		display: "inline-block",
		[theme.breakpoints.up("lg")]: {
			display: "block",
			marginBottom: theme.spacing(2) + "px",
			marginRight: 0
		}
	},
	catButton: {
		height: "210px",
		[theme.breakpoints.up("lg")]: {
			height: "auto"
		}
	},
	iconRed: {
		fill: red[900]
	},
	iconBlue: {
		fill: blue[900]
	},
	iconGreen: {
		fill: green[900]
	},
	iconOrange: {
		fill: orange[900]
	},
	iconPurple: {
		fill: purple[900]
	}
});

class SwimLaneTitle extends Component {
	// This component should never update
	shouldComponentUpdate() {
		return false;
	}

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<p className={classes.catTitle}>
					{titleIcon(this.props.category, classes)}{" "}{/* space inserted by prettier */}
					{this.props.category}
				</p>
				{/* <Paper className={classes.catPaper} variant="outlined">
					<Button className={classes.catButton} color="primary">Add To-Do</Button>
					you click this and it does an update.php insert thing; then the swimlanes re-render?
				</Paper> */}
			</React.Fragment>
		);
	}
}

// Pair the correct icon with the title
function titleIcon(category, classes) {
	if (category === "General") {
		return <Build className={`${classes.catIcon} ${classes.iconRed}`} />;
	} else if (category === "Security") {
		return <Lock className={`${classes.catIcon} ${classes.iconBlue}`} />;
	} else if (category === "Accessibility") {
		return (
			<AccessibilityNew
				className={`${classes.catIcon} ${classes.iconGreen}`}
			/>
		);
	} else if (category === "SEO") {
		return (
			<Search className={`${classes.catIcon} ${classes.iconOrange}`} />
		);
	} else {
		return (
			<InvertColors
				className={`${classes.catIcon} ${classes.iconPurple}`}
			/>
		);
	}
}

SwimLaneTitle.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SwimLaneTitle);