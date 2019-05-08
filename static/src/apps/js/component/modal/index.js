import React from 'react';
import './style.less'

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "",
            modalBack: '',
            visible: false
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.setState({
                visible: true,
                active: "enter",
                modalBack: "modalEnter"
            })
        } else {
            this.setState({
                active: "leave",
                modalBack: "modalLeave"
            }, () => {
                setTimeout(()=>{
                    this.setState({
                        visible: false,
                    })
                },400)
            })
        }

    }

    stop = (event) => {
        event.stopPropagation();
    };

    render() {
        const {visible, active, modalBack} = this.state;
        const {title, onOk, onCancel} = this.props;
        return (<div>
                {visible ?
                    <div className={`modal ${modalBack}`} onClick={onCancel}>
                        <div className="modal-wrap">
                            <div className={`modal-content ${active}`} onClick={this.stop}>
                                {title === undefined?"":<div className="modal-header">
                                    <div className="modal-title">{title}</div>
                                </div>}
                                <div className="modal-body">
                                    {this.props.children}
                                </div>
                                <div className="modal-footer">
                                    <div>
                                        <button onClick={onCancel} type="button" className="btn">
                                            <span>取 消</span>
                                        </button>
                                        <button onClick={onOk} type="button" className="btn btn-primary">
                                            <span>确 定</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null}
            </div>

        );
    }

}

export default Modal;