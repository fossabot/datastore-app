import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import DialogRoot from './DialogRoot';
import { createAndDisplayValue } from 'actions/actions';
import { validateKeyOrNamespace } from '../../utils/validation';

export class NewNamespaceDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            namespaceValue: '',
            keyValue: '',
            namespaceError: '',
            keyError: '',
        };

        this.handleCreate = this.handleCreate.bind(this);
    }


    handleNamespaceInput(event) {
        const val = event.target.value;
        this.setState({
            namespaceError: validateKeyOrNamespace(val).message,
            namespaceValue: event.target.value,
        });
    }

    handleKeyInput(event) {
        const val = event.target.value;
        this.setState({
            keyError: validateKeyOrNamespace(val).message,
            keyValue: event.target.value,
        });
    }

    handleClose() {
        this.props.closeDialog();
    }

    handleCreate() {
        const { namespaceValue, keyValue } = this.state;
        return new Promise((resolve, reject) => {
            const validatedNamespace = validateKeyOrNamespace(namespaceValue);
            const validatedKey = validateKeyOrNamespace(keyValue);

            if (validatedKey.valid && validatedNamespace.valid) {
                this.props.createNamespace(namespaceValue, keyValue);
                resolve();
            } else {
                this.setState({
                    keyError: validatedKey.message,
                    namespaceError: validatedNamespace.message,
                });
                reject();
            }
        })

    }

    render() {
        const fieldStyle = {
            display: 'block',
            width: '100%',
        };

        return (
            <DialogRoot
                title="New namespace"
                approveAction={this.handleCreate}
                cancelAction={this.props.closeDialog}
                contentStyle={{ maxWidth: '500px'}}
            >
                <TextField autoFocus hintText="Namespace" style={fieldStyle}
                    errorText={this.state.namespaceError}
                    onChange={this.handleNamespaceInput.bind(this)}
                />
                <TextField fullWidth hintText="Key name" style={{fieldStyle}}
                    errorText={this.state.keyError}
                    onChange={this.handleKeyInput.bind(this)}
                />
            </DialogRoot>

        );
    }
}

NewNamespaceDialog.propTypes = {
    namespace: PropTypes.string,
    closeDialog: PropTypes.func,
    createNamespace: PropTypes.func,
};

const mapStateToProps = state => ({
    namespace: state.dialog.namespace,
});

const mapDispatchToProps = dispatch => ({
    createNamespace(namespace, key) {
        dispatch(createAndDisplayValue(namespace, key));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewNamespaceDialog);
