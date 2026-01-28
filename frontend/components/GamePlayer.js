'use client';
// components/GamePlayer.js
import { use, useEffect, useRef } from "react";
import { useContext } from "react";
import {PreferencesContext} from "../context/PreferencesContext";

export default function GamePlayer({ swfPath, width=800, height=600}) {
  let {preferences} = useContext(PreferencesContext);
  // console.log("GamePlayerContainer preferences", preferences);
  useEffect(() => {
    if (preferences) {
      console.log("GamePlayerContainer preferences", preferences);
    }
  }, [preferences]);
  
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const playTimeRef = useRef(0); // total play time in ms
  const playStartRef = useRef(null); // timestamp when play started
  onPlay(); // reset play time on each render
  // Load Ruffle and SWF
  useEffect(() => {
    let player;
    const loadRuffle = async () => {
      if (!window.RufflePlayer) {
        // const ruffle = require('@ruffle-rs/ruffle')
        console.log("Loading Ruffle Player...");
        const script = document.createElement("script");
        script.src = "/ruffle/ruffle.js";
        document.body.appendChild(script);
        await new Promise((res) => (script.onload = res));
      }
      const ruffle = window.RufflePlayer?.newest();
      if (ruffle && containerRef.current) {
        player = ruffle.createPlayer();
        player.style.width = `${width}px`;
        player.style.height = `${height}px`;
        containerRef.current.appendChild(player);
        player.load(swfPath);
        playerRef.current = player;
      }
    };
    loadRuffle();

    return () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, [swfPath, width, height]);

  // Pause/resume when not visible/visible
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (playerRef.current) {
          if (entry.isIntersecting) {
            playerRef.current.play && playerRef.current.play();
          } else {
            playerRef.current.pause && playerRef.current.pause();
            // onPlayTime(gameId, playTimeRef.current);
            // onTerminate()
          }
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} style={{ width, height }} />;
}