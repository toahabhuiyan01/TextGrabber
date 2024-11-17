/* global chrome */

import { Button, Grid2 as Grid, List, ListItem, Typography } from "@mui/material";

export default function KeyWordList({ keywords, goBack, setKeywords }) {
  return (
    <Grid
      display='flex'
      flexDirection='column'
      gap={2}
    >
        <Grid px={2}>
            <Button
                variant='outlined'
                color='primary'
                size='small'
                onClick={goBack}
            >
                Go Back
            </Button>
        </Grid>
        <List>
            {
                keywords.map((keyword, index) => (
                    <ListItem 
                        key={index}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            height: '32px',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Grid
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                gap: 1
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                            >
                                {index + 1}
                            </Typography>
                            <Typography
                                variant="subtitle2"
                            >
                                {keyword}
                            </Typography>
                        </Grid>
                        <Button
                            variant="text"
                            size="small"
                            color="error"
                            onClick={
                                () => {
                                    chrome.storage.local.get({ selectedTexts: [] }, (data) => {
                                        const keywords = data.selectedTexts
                                        const newKeywords = keywords.filter((text) => text !== keyword)
                                        chrome.storage.local.set({ selectedTexts: newKeywords }, () => {
                                            setKeywords(newKeywords)
                                        })
                                    })
                                }
                            }
                        >
                            Delete
                        </Button>
                    </ListItem>
                ))
            }
        </List>
    </Grid>
  )
}