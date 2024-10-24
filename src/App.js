/*global chrome*/

import { Button, Checkbox, Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ShowSelections from './ShowSelections';

function App() {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [shouldListen, setShouldListen] = useState(false);
  const [showFullView, setShowFullView] = useState(false);

  // Fetch stored texts from chrome storage
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if(!shouldListen) {
        return
      }

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
    });

    emmitMessage({ type: 'SHOULD_LISTEN', shouldListen });
  }, [shouldListen]);

  useEffect(
    () => {
      chrome.storage.local.get({ selectedTexts: [] }, (result) => {
        console.log('Fetched selected texts:', result?.selectedTexts);
        setSelectedTexts(result?.selectedTexts || []);
        emmitMessage({ type: "INIT", selectedTexts: result?.selectedTexts || [] });
      });
    }, []
  )

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
  const fullViewStyle = showFullView ? {
    height: '50rem',
    width: '35rem'
  } : {}

  return (
    <Grid2
      p={2}
      gap={2}
      display='flex'
      flexDirection='column'
      sx={{ width: '35rem', ...fullViewStyle }}
    >
      <Grid2
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        gap={2}
      >
        <Grid2 
          display='flex'
          flexDirection='row'
          alignItems='center'
          gap={2}
        >
          <Typography variant='caption'>Should Listen</Typography>
          <Checkbox
            checked={shouldListen}
            onChange={() => setShouldListen(!shouldListen)}
          />
        </Grid2>

        <Grid2 
          display='flex'
          flexDirection='row'
          alignItems='center'
          gap={2}
        >
          <Typography variant='caption'>Show FullView</Typography>
          <Checkbox
            checked={showFullView}
            onChange={() => setShowFullView(!showFullView)}
          />
        </Grid2>

        <Button
          variant='outlined'
          color='error'
          size='small'
          onClick={clearSelections}
        >
          Clear Selections
        </Button>
      </Grid2>
      {
        showFullView && (
          <ShowSelections selectedTexts={selectedTexts} />
        )
      }
    </Grid2>
  );
}

export default App;

