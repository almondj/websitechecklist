import React, { Component } from "react";

// Material UI Items
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from "@material-ui/core/Button";

const styles = theme => ({
});

class Error extends Component {

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<Dialog
				  open={this.props.open}
				  onClose={this.props.close}
				  aria-labelledby="error-title"
				>
				  <DialogTitle id="error-title">Error</DialogTitle>
				  <DialogContent>
				    <DialogContentText>There was an error processing your request. Your changes have not been saved. Please check your internet connection.</DialogContentText>
				  </DialogContent>
				  <DialogActions>
				    <Button onClick={this.props.close} color="primary">
				      Close
				    </Button>
				  </DialogActions>
				</Dialog>
			</React.Fragment>
		);
	}
}

Error.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Error);