import React, { useState, useEffect, useRef } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './client';
import Login from './Login';
import styled, { createGlobalStyle } from 'styled-components';

const Chat = ({ user }) => {
	const [messages, setMessages] = useState([]);
	const [content, setContent] = useState('');
	const [isSending, setIsSending] = useState(false);
	const messageContainerRef = useRef(null);

	useEffect(() => {
		const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
		setMessages(savedMessages);
	}, []);

	useEffect(() => {
		const handleStorageChange = () => {
		const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
		setMessages(savedMessages);
		};
		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, []);

	useEffect(() => {
		if (messageContainerRef.current) {
		messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMessage = () => {
		if (!content) return;

		setIsSending(true);

		const newMessage = {
		id: Date.now().toString(),
		user,
		content,
		};

		const updatedMessages = [...messages, newMessage];
		localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));

		setTimeout(() => {
		setMessages(updatedMessages);
		setContent('');
		setIsSending(false);
		}, 200);
	};

	return (
		<ChatContainer>
		<h2>Chat de {user}</h2>
		<MessageContainer ref={messageContainerRef}>
			{messages.map((msg) => (
			<Message key={msg.id} $isOwnMessage={msg.user === user}>
				<MessageContent>
				{msg.user !== user ? (
					<>
					<MessageFooter>{msg.user}</MessageFooter>
					<strong>{msg.content}</strong>
					</>
				) : (
					<>
					<MessageFooter>{msg.content}</MessageFooter>
					</>
				)}
				</MessageContent>
			</Message>
			))}
		</MessageContainer>

		{isSending && <p>Enviando...</p>}

		<InputContainer>
			<MessageInput
			type="text"
			placeholder="Escribe un mensaje"
			value={content}
			onChange={(e) => setContent(e.target.value)}
			/>
			<SendButton onClick={handleSendMessage} disabled={isSending}>
			{isSending ? 'Enviando...' : 'Enviar'}
			</SendButton>
		</InputContainer>
		</ChatContainer>
	);
	};

	const App = () => {
	const [loggedInUser, setLoggedInUser] = useState(sessionStorage.getItem('chatUser') || '');

	const handleLogin = (username) => {
		sessionStorage.setItem('chatUser', username);
		setLoggedInUser(username);
	};

	return loggedInUser ? <Chat user={loggedInUser} /> : <Login onLogin={handleLogin} />;
	};

	const AppWithApolloProvider = () => (
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>
	);

	export default AppWithApolloProvider;

	const GlobalStyle = createGlobalStyle`
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body, html {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	`;

	const ChatContainer = styled.div`
	background-color: #f8f9fa;
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	padding: 0;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	overflow: hidden;
	max-width: 750px; 
	margin: 0 auto; 
	`;

	const MessageContainer = styled.div`
	flex: 1;
	width: 100%;
	overflow-y: auto;
	padding: 15px;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	`;

	const Message = styled.div`
	background-color: ${(props) => (props.$isOwnMessage ? '#d1f8e7' : '#e9ecef')};
	padding: 12px;
	margin: 8px 0;
	border-radius: 25px;
	max-width: 75%;
	margin-left: ${(props) => (props.$isOwnMessage ? 'auto' : '0')};
	margin-right: ${(props) => (props.$isOwnMessage ? '0' : 'auto')};
	text-align: ${(props) => (props.$isOwnMessage ? 'right' : 'left')};
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	`;

	const MessageContent = styled.div`
	font-size: 14px; /* Aumenta el tamaño de la fuente */
	line-height: 1.4;
	`;

	const MessageFooter = styled.p`
	font-size: 12px; /* Ajusta el tamaño del pie del mensaje */
	color: #777;
	text-align: ${(props) => (props.$isOwnMessage ? 'right' : 'left')};
	margin-top: 5px;
	`;

	const InputContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 15px;
	background-color: #ffffff;
	border-top: 1px solid #ccc;
	`;

	const MessageInput = styled.input`
	padding: 15px;
	width: 90%;
	border: 1px solid #ccc;
	border-radius: 50px;
	font-size: 14px; /* Aumenta el tamaño de la fuente en el campo de texto */
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	`;

	const SendButton = styled.button`
	padding: 12px 20px;
	background-color: #007bff;
	color: white;
	border: none;
	border-radius: 50px;
	font-size: 14px; /* Aumenta el tamaño de la fuente del botón */
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #0056b3;
	}

	&:disabled {
		background-color: #bdbdbd;
		cursor: not-allowed;
	}
	`;
