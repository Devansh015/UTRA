# R2Detour

R2Detour is an autonomous line-following robot designed to navigate high-contrast tracks using infrared sensing and PID-based motor control. The project focuses on reliable navigation, smooth control behavior, data-driven tuning, and verifiable run results using modern cloud and blockchain tooling.

This project was developed for **UTRA Hacks 2026**.

## TLDR

- Autonomous line-following robot built with an Arduino Uno and IR sensor array  
- Uses a PID control loop for smooth, stable navigation  
- Streams real-time telemetry to MongoDB Atlas for data-driven tuning  
- Analyzes run performance using time series data and aggregation pipelines  
- Records verifiable run results on the Solana blockchain via NFT-based metadata  
- Designed and built for UTRA Hacks
---

## What It Does

R2Detour autonomously follows high-contrast paths (colored tape on light surfaces) using an infrared sensor array. A PID (Proportional-Integral-Derivative) control loop dynamically adjusts motor speeds to maintain alignment with the track.

Key capabilities include:
- Smooth curvature handling using continuous PID correction
- Detection of intersections and temporary line loss
- Recovery behaviors when the line is no longer detected
- Visual status feedback through onboard LEDs

---

## System Architecture

### Hardware Components
- **Microcontroller:** Arduino Uno  
- **Sensors:** 5-channel IR sensor array (TCRT5000)  
- **Motors:** Dual DC motors  
- **Motor Driver:** L298N H-Bridge  
- **Power Supply:** Rechargeable 9V Li-Po battery pack  
- **Chassis:** Laser-cut acrylic frame  

### Control Logic
- Custom PID control algorithm written in C++
- Error calculation based on weighted sensor activation
- High-frequency PWM updates for responsive motor control
- Optional signal filtering to reduce sensor noise

---

## Data Analysis with MongoDB Atlas

To enable systematic PID tuning and performance analysis, R2Detour streams telemetry data to **MongoDB Atlas** during test runs.

### Time Series Data Storage
- Sensor states
- Motor PWM values
- PID error terms

Atlas Time Series collections allow efficient ingestion and querying of high-frequency telemetry data without rigid schemas.

### Visualization
- MongoDB Charts dashboards were used to visualize:
  - PID oscillation behavior
  - Error convergence over time
  - Motor response symmetry

### Aggregation Pipelines
Custom aggregation pipelines were implemented to:
- Identify track segments with increased instability
- Measure run consistency
- Analyze battery usage patterns across runs

---

## On-Chain Verification with Solana

R2Detour includes a "Proof of Run" mechanism to ensure the integrity of recorded results.

### NFT Minting
- A finish-line image is captured at the end of each run
- The image is minted as an NFT using the Metaplex standard on Solana

### Immutable Metadata
Each NFT includes:
- Total run time (milliseconds)
- Average velocity
- PID configuration hash

### Decentralized Storage
- Image assets stored on Arweave
- Metadata hash committed on Solana
- Provides tamper-resistant verification of performance data

---

## Challenges

- **Sensor Interference:** Infrared sensors were affected by ambient and reflective light, requiring physical shielding.
- **PID Tuning:** Achieving stability required extensive tuning to balance responsiveness and oscillation.
- **Hardware Constraints:** Limited motor precision and voltage drops affected consistency at higher speeds.
- **Cable Management:** Physical organization was necessary to maintain reliability during motion.

---

## Accomplishments

- Stable PID-based line tracking with smooth curvature handling
- Successful real-time telemetry ingestion and visualization
- Secure, verifiable run recording using blockchain infrastructure
- Reliable operation under varied lighting conditions

---

## Built With

- Arduino (C++)
- MongoDB Atlas (Time Series, Aggregation, Charts)
- Solana Blockchain
- Metaplex
- Arweave

---

<img width="430" height="573" alt="image" src="https://github.com/user-attachments/assets/af55c02a-afdc-4f24-9c88-44d5a86da43c" />
