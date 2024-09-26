import LikeButton from './like-button';
import {List, ListItemButton, Typography} from "@mui/material";

function Header({ title }) {
    return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
    const names = ['Hailey Welch', 'Grace Hopper', 'Margaret Hamilton'];

    return (
        <div>
            <Typography variant="h1">Develop. Preview. Ship.</Typography>
            <List>
                {names.map((name) => (
                    <ListItemButton key={name}>{name}</ListItemButton>
                ))}
            </List>
            <LikeButton />
        </div>
    );
}
