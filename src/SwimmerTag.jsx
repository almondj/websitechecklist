import React, { Component } from "react";
import axios from "axios";

// Material UI Items
import PropTypes from "prop-types";
import { withStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Save from "@material-ui/icons/Save";

// Custom styling for material components
const styles = theme => ({
	noteField: {
		display: "block",
		marginBottom: theme.spacing(2)
	}
});

// Material overrides to handle save icon in textField
const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      // Name of the rule
      root: {
        height: 'auto',
        minHeight: '45px',
      }
    },
    MuiInputLabel: {
    	formControl: {
    		transform: 'translate(0, 36px) scale(1)',
    	}
    }
  },
  typography: { useNextVariants: true }, // ?, was in documentation
});

class SwimmerTag extends Component {
	constructor(props) {
		super(props);
		this.state = {
			note: this.props.value,
			swimmer: this.props.swimmer,
			hash: this.props.hash,
			completed: this.props.completeVal,
			active: false
		};
	}

	// Should only update with a new note
	shouldComponentUpdate(nextState) {
		if (this.state.note !== nextState.note) {
			return true;
		}
		return false;
	}

	// Note is being edited
	handleNote(noteVal) {
		this.setState({
			note: noteVal,
			active: true
		});
	}

	handleSave() {
		// Update notes for the swimmer
		let status = this;
		var params = new URLSearchParams();
		params.append("hash", this.state.hash);
		params.append("swimmer", this.state.swimmer);
		params.append("part", "note");
		params.append("val", this.state.note); // formerly noteVal
		axios
			.post("../update.php", params)
			.then(function(response) {
				console.log("done", response);
				// show a determinate loader
				// https://codesandbox.io/s/50kypzl4wk
				status.props.progress();
				status.setState({ active: false });
			})
			.catch(function(error) {
				// Show an error window
				console.log(error);
				status.props.error();
			});
	}

	render() {
		const { classes } = this.props;

		return (
			<React.Fragment>
				<MuiThemeProvider theme={theme}>
				<TextField
					label="Notes"
					aria-label="Notes"
					multiline
					rowsMax="4"
					onChange={e => this.handleNote(e.target.value)}
					margin="normal"
					value={this.state.note}
					className={classes.noteField}
					fullWidth
					variant="outlined"
					InputProps={{
						maxLength: "500",
						"aria-label": "Notes",
						endAdornment: (
							<InputAdornment position="end">
								{this.state.active ? (
									<IconButton
										aria-label="Save"
										onClick={e => this.handleSave()}
									>
										<Save />
									</IconButton>
								) : (
									""
								)}
							</InputAdornment>
						)
					}}
				/>
				</MuiThemeProvider>
			</React.Fragment>
		);
	}
}

SwimmerTag.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SwimmerTag);