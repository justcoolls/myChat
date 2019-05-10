import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class Notice extends Component {
    //规定了每个属性的类型,any表示任意类型
    static propTypes = {
        duration: PropTypes.number, //组件挂载后多久关闭
        onClose: PropTypes.func, //当notice关闭后被调用的函数
        children: PropTypes.any, //子元素
        update: PropTypes.bool, //update属性为true时，组件更新会重启定时器
        closeIcon: PropTypes.node //指定的close icon
    };

    //定义了默认的属性
    static defaultProps = {
        onClose() {
        }, //Notice没有定义关闭的具体细节，由使用者发挥
        duration: 1.5,
        style: {
            right: '50%'
        }
    };

    componentDidMount() {
        //启动关闭组件的定时器
        this.startCloseTimer();
    }

    componentDidUpdate(prevProps) {
        if (this.props.duration !== prevProps.duration
            || this.props.update) {
            this.restartCloseTimer();
        }
    }

    componentWillUnmount() {
        //组件卸载了，清除定时器
        this.clearCloseTimer();
    }

    close = () => {
        this.clearCloseTimer();
        this.props.onClose();
    };

    startCloseTimer = () => {
        //duration 默认为1.5秒。if的含义是，duration不能设置为0和null,undefined
        if (this.props.duration) {
            this.closeTimer = setTimeout(() => {
                this.close();
            }, this.props.duration * 1000);
        }
    };

    clearCloseTimer = () => {
        if (this.closeTimer) {
            //清除定时器，并将this.closeTimer设置为null
            clearTimeout(this.closeTimer);
            this.closeTimer = null;
        }
    };

    restartCloseTimer() {
        //重启关闭组件的定时器。重启前，先清除定时器。
        this.clearCloseTimer();
        this.startCloseTimer();
    }

    render() {
        const props = this.props;
        //componentClass表示整个组件的样式前缀
        const componentClass = `${props.prefixCls}-notice`;
        //使用classNames得出组件实际的css类,因为classNames会过滤掉值为false的css类。
        const className = {
            [`${componentClass}`]: 1,
            [`${componentClass}-closable`]: props.closable,
            [props.className]: !!props.className,
        };
        return (
            //鼠标移到组件时，清除定时器。移出组件，开启定时器。
            //组件没有定义样式。使用者可以传入样式类的前缀prefixCls。
            <div className={classNames(className)} style={props.style} onMouseEnter={this.clearCloseTimer}
                 onMouseLeave={this.startCloseTimer}
            >
                <div className={`${componentClass}-content`}>{props.children}</div>
                {props.closable ?
                    <a tabIndex="0" onClick={this.close} className=    {`${componentClass}-close`}>
                        {props.closeIcon || <span className={`${componentClass}-close-x`}/>}
                    </a> : null
                }
            </div>
        );
    }
}