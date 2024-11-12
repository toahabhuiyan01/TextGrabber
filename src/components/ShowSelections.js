import { Button, Grid2 as Grid, TextareaAutosize, Typography } from "@mui/material";
import { useMemo } from "react";

const MATCHES = [
    {
        name: "Exact",
        getText: (text) => `[${text}]`
    },
    {
        name: "Phrase",
        getText: (text) => `"${text}"`
    },
    {
        name: "Broad",
        getText: (text) => text
    }

]

export default function ShowSelections({ selectedTexts }) {
    const matchingTexts = useMemo(
        () => {
            return MATCHES.map(match => {
                return selectedTexts.map(text => match.getText(text)).join('\n')
            })
        },
        [selectedTexts]
    )

    return (
        <Grid
            display='flex'
            flexDirection='row'
            justifyContent='center'
            flexWrap='wrap'
            gap={3}
        >
            {
                matchingTexts.map((text, index) => (
                    <CopyableText
                        key={index} 
                        text={text} 
                        index={index}
                    />
                ))
            }
        </Grid>
    )
}

function CopyableText({ text, index }) {
    return (
        <Grid
            display='flex'
            flexDirection='column'
            width='100%'
            gap={2}
        >
            <Typography variant="h6">{MATCHES[index].name} Match</Typography>
            <TextareaAutosize
                style={{
                    minWidth: '17rem'
                }}
                value={text}
                readOnly
            />

            <Button
                variant='outlined'
                size="small"
                onClick={() => navigator.clipboard.writeText(text)}
            >
                Copy
            </Button>
        </Grid>
    )
}