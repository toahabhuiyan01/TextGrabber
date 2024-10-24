/*global chrome*/

import { Checkbox, Grid2, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ShowSelections from './ShowSelections';

function App() {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [showFullView, setShowFullView] = useState(false);

  // Fetch stored texts from chrome storage
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(message)
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

    chrome.storage.local.get({ selectedTexts: [] }, (result) => {
      console.log('Fetched selected texts:', result?.selectedTexts);
      setSelectedTexts(result?.selectedTexts || []);
    });
  }, []);

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
      sx={{ width: '10rem', ...fullViewStyle }}
    >
      <Grid2 
        display='flex'
        flexDirection='row'
        alignItems='center'
        gap={2}
      >
        <Typography>Show FullView</Typography>
        <Checkbox
          checked={showFullView}
          onChange={() => setShowFullView(!showFullView)}
        />
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

