import { Button, Grid2 as Grid, Typography } from "@mui/material";

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
        name: "Board",
        getText: (text) => `+${text}`
    },
    {
        name: "P & E",
        getText: (text) => `"${text}"\n[${text}]`
    },
    {
        name: "P & B",
        getText: (text) => `"${text}"\n+${text}`
    },
    {
        name: "E & B",
        getText: (text) => `[${text}]\n+${text}`
    },
    {
        name: "All",
        getText: (text) => `"${text}"\n[${text}]\n+${text}`
    }

]

export default function ShowSelections({ selectedTexts }) {
    return (
        <Grid>
            <h3>Stored Selected Texts:</h3>
            {
                selectedTexts.map((text, index) => (
                    <CopyableText key={index} text={text} />
                ))
            }
        </Grid>
    )
}

function CopyableText({ text }) {
    return (
        <Grid>
            <Typography variant="body1">{text}</Typography>
            {
                MATCHES.map((match, index) => (
                    <Button 
                        key={index} 
                        size="small"
                        onClick={() => navigator.clipboard.writeText(match.getText(text))}
                    >
                        {match.name}
                    </Button>
                ))
            }
        </Grid>
    )
}