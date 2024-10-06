'use client';

import { useState } from 'react';
import {Button} from "@mui/material";

export default function LikeButton() {
    const [likes, setLikes] = useState(0);

    function handleClick() {
        setLikes(likes + 1);
    }

    return <Button onClick={handleClick} variant="contained" >Like ({likes})</Button>;
}