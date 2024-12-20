/*global chrome*/

import { Button, Grid2, IconButton, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import ShowSelections from './components/ShowSelections';
import KeyWordList from './components/ShowKeywordList';
import YT from './assets/youtube.svg'
import LI from './assets/linkedin.svg'
import Web from './assets/web.png'

const SOCIAL_LINKS = [
	{
		url: 'https://www.youtube.com/@iambarkat/videos',
		icon: YT
	},
	{
		url: 'https://www.linkedin.com/in/iambarkat/',
		icon: LI
	},
	{
		url: 'https://iambarkat.com/',
		icon: Web
	}
]

function App() {
	const [selectedTexts, setSelectedTexts] = useState([]);
	const [shouldListen, setShouldListen] = useState(false);
	const [showList, setShowList] = useState(false);

	// Fetch stored texts from chrome storage
	useEffect(() => {
		if(shouldListen) {
			chrome.runtime.onMessage.addListener(messageListener);
		} else {
			chrome.runtime.onMessage.removeListener(messageListener);
		}
		emmitMessage({ type: 'SHOULD_LISTEN', shouldListen });
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shouldListen]);

	useEffect(
		() => {
			chrome.storage.local.get({ selectedTexts: [] }, (result) => {
				console.log('Fetched selected texts:', result?.selectedTexts);
				setSelectedTexts(result?.selectedTexts || []);
				emmitMessage({ type: "INIT", selectedTexts: result?.selectedTexts || [] });
			});


			return () => {
			emmitMessage({ type: 'SHOULD_LISTEN', shouldListen: false });
			}
		}, []
	)

	const messageListener = useCallback((message, sender, sendResponse) => {
		if (message.type === 'TEXT_SELECTED') {
			// Store the selected text in the state
			setSelectedTexts((texts) => {
				const allTexts = [...texts, message.text]
				chrome.storage.local.set({ selectedTexts: allTexts }, () => {
					console.log('Selected text stored in background:', allTexts);
				});
				return allTexts;  
			});
		}
	}, [])

	function clearSelections() {
		chrome.storage.local.set({ selectedTexts: [] }, () => {
			console.log('Selected text stored in background:', []);
		});

		emmitMessage({ type: 'CLEAR_SELECTIONS' });
		setSelectedTexts([]);
	}

	function emmitMessage(message) {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if(!tabs?.[0]?.id) {
				return
			}
			chrome.tabs.sendMessage(tabs[0].id, message);
		});
	}

	if(showList) {
		return (
			<KeyWordList
				keywords={selectedTexts || []}
				goBack={() => setShowList(false)}
				setKeywords={setSelectedTexts}
			/>
		)
	}

	return (
		<Grid2
			display='flex'
			flexDirection='column'
			justifyContent='start'
			width='100%'
			height='100%'
			p={0}
			m={0}
		>
			<Grid2
				p={2}
				gap={4}
				display='flex'
				flexDirection='column'
				sx={{ width: '100%', height: '100%' }}
			>
				<Grid2
					display='flex'
					flexDirection='row'
					justifyContent='start'
					flexWrap='wrap'
					gap={1}
				>
					<Button
						variant='outlined'
						color='primary'
						size='small'
						onClick={() => setShouldListen(!shouldListen)}
					>
						<Typography variant='caption'>
							{
								shouldListen ? 'Stop' : 'Start'
							}
						</Typography>
					</Button>
					<Button
						variant='outlined'
						color='primary'
						size='small'
						onClick={() => setShowList(!showList)}
					>
						<Typography variant='caption'>
							{
								showList ? 'List' : 'List'
							}
						</Typography>
					</Button>
					<Button
						variant='outlined'
						color='error'
						size='small'
						onClick={clearSelections}
					>
						<Typography variant='caption'>
							Clear All
						</Typography>
					</Button>
				</Grid2>
				<ShowSelections selectedTexts={selectedTexts || []} />
			</Grid2>
		
			<Grid2
				display='flex'
				flexDirection='row'
				justifyContent='center'
				alignItems='center'
				position='fixed'
				bottom={0}
				left={0}
				gap={2}
				height='32px'
				width='100vw'
				sx={{
					backgroundColor: '#000',
					width: '100%',
					px: '20px'
				}}
			>
				<Typography
					variant='subtitle2'
					color='white'
				>
					Find Us On:
				</Typography>
				{
					SOCIAL_LINKS.map((link, index) => (
						<a
						 	href={link.url}
							key={index}
							target='_blank'
							rel='noreferrer'
						>
							<img
								src={link.icon}
								alt='social'
								height={30}
								width={30}
							/>
						</a>
					))
				}
			</Grid2>
		</Grid2>
	);
}

export default App;

