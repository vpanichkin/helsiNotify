import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Spinner from './Spinner';

const Title = styled.h1`
    display:flex;
    flex-direction: column;
    align-self:center;
    font-size:7vmin;
    margin-bottom:2vh;
    font-family: 'LatoBold';
    text-align:center;
`;

const Subtitle = styled.h2`
    display:flex;
    flex-direction: column;
    align-self:center;
    font-size:4vmin;
    margin-bottom:8vmin;
    font-family: 'LatoBold';
    text-align:center;
`;

export default class FirstPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputValue = this.handleInputValue.bind(this);
        this.goPersonalPage = this.goPersonalPage.bind(this);
    }
    state = {
        email: '',
        password: '',
        submitted: false
    };
    handleInputValue(event) {
        switch (event.target.id) {
            case 'password': {
                return this.setState({
                    password: event.target.value
                });
            }
            case 'email': {
                return this.setState({
                    email: event.target.value
                });
            }
            default: {
                return '';
            }
        }
    }
    goPersonalPage(event) {
        let self = this;
        event.preventDefault();
        this.setState(
            {
                submitted: true
            },
            () => {
                this.forceUpdate();
            }
        );
        axios
            .post('/appSignIn', this.state)
            .then(user => {
                console.log(user);
                if (user.data.statusHelsiCode === '200') {
                    alert('successful login');
                    self.history.push(`/user/${user.data.id}/`);
                } else {
                    alert(user.data.errorHelsiMsg);
                    this.setState(
                        {
                            submitted: false
                        },
                        () => {
                            this.forceUpdate();
                        }
                    );
                }
            })
            .catch(err => {
                console.error('axios error', err); // eslint-disable-line no-console
            });
    }
    render() {
        const submitted = this.state.submitted
            ? <Spinner />
            : <input id="clickSubmit" type="submit" value="Спробувати" />;
        return (
            <div className="main_wrap">
                <div className="bgOpac">
                    <Title>Не можеш знайти вільний час у лікаря?</Title>
                    <Subtitle>Ми зробимо це для тебе!</Subtitle>
                    <h3 className="description">
                        Helsi Notify - це платформа для зекономлення часу на очікування вільного місця до лікаря. Як тільки лікар буде вільним - ми вам про це скажемо
                    </h3>
                    <div className="form">
                        <form className="inputform" method="post" onSubmit={this.goPersonalPage}>
                            <input
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={this.state.email}
                                required
                                onChange={this.handleInputValue}
                            />
                            <input
                                type="password"
                                id="password"
                                placeholder="Пароль"
                                value={this.state.password}
                                required
                                onChange={this.handleInputValue}
                            />
                            {submitted}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
