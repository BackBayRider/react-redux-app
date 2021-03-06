import React from 'react'
import timezones from '../data/timezones'
import map from 'lodash/map'
import classnames from 'classnames'
import validateInput from '../../server/shared/validations/signup'
import TextFieldGroup from './common/TextFieldGroup'

class SignupForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			email: '',
			password: '',
			passwordConfirmation: '',
			timezone: '',
			errors: {},
			isLoading: false,
			invalid: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.checkUserExists = this.checkUserExists.bind(this);
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	isValid() {
		const { errors, isValid } = validateInput(this.state);

		if (!isValid) {
			this.setState({ errors });
		}

		return isValid;

	}
	checkUserExists(e) {
		const field = e.target.name;
		const val = e.target.value;
		if (val !== '') {
			this.props.isUserExists(val).then(res => {
				let errors = this.state.errors;
				let invalid;
				if (res.data.user) {
					errors[field] = 'There is user with such ' + field;
					invalid = true;
				} else {
					errors[field] = '';
					invalid = false;
				}
				this.setState({ errors, invalid });
			});
		}
	}
	onSubmit(e) {
		e.preventDefault();

		if (this.isValid()) {

			this.setState({ isLoading: true });
			this.props.userSignupRequest(this.state).then(
				() => {
					this.props.addFlashMessage({
						type: 'success',
						text: 'You signed up successfully. Welcome!'
					})
					this.context.router.push('/');
				},
				({ data }) => this.setState({ errors: data, isLoading: false })
			);

		}
	}
	render() {
		const { errors } = this.state;
		const options = map(timezones, (val, key) => 
			<option key = {val} value = {val}>{key}</option>
		);
		return (
			<form onSubmit = {this.onSubmit}>
				<h1>Join our community!</h1>

				<TextFieldGroup
					error = {errors.username}
					label = "Username"
					onChange = {this.handleChange}
					value = {this.state.username}
					checkUserExists = {this.checkUserExists}
					field = "username" />
				<TextFieldGroup
					error = {errors.email}
					label = "Email"
					onChange = {this.handleChange}
					value = {this.state.email}
					checkUserExists = {this.checkUserExists}
					field = "email" />					
				<TextFieldGroup
					error = {errors.password}
					label = "Password"
					type = "password"
					onChange = {this.handleChange}
					value = {this.state.password}
					field = "password" />
				<TextFieldGroup
					error = {errors.passwordConfirmation}
					label = "Reenter Password"
					type = "password"
					onChange = {this.handleChange}
					value = {this.state.passwordConfirmation}
					field = "passwordConfirmation" />

				<div className = {classnames("form-group", { 'has-error': errors.timezone })}>
					<label className = "control-label">Timezone</label>
					<select
						className = "form-control"
						name = "timezone"
						onChange = {this.handleChange}
						value = {this.state.timezone}>
						<option value = '' disabled>Choose Your Timezone</option>
						{options}
					</select>
					{errors.timezone && <span className = "help-block">{errors.timezone}</span>}
				</div>															
															
				<div className="form-group">
					<button disabled = {this.state.isLoading || this.state.invalid} className="btn btn-primary btn-lg">Sign Up</button>
				</div>
			</form>
		);
	}
}

SignupForm.propTypes = {
	userSignupRequest: React.PropTypes.func.isRequired,
	addFlashMessage: React.PropTypes.func.isRequired,
	isUserExists: React.PropTypes.func.isRequired
}

SignupForm.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default SignupForm;