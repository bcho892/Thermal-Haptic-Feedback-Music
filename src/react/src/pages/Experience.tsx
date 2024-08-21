import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ArmHeatmap from "@/components/wrappers/ArmHeatmap/ArmHeatmap";
import ArousalGraph from "@/components/wrappers/ArousalGraph/ArousalGraph";
import MusicPlayer from "@/components/wrappers/MusicPlayer/MusicPlayer";
import TemperatureUpload from "@/components/wrappers/TemperatureUpload/TemperatureUpload";
import { TemperatureDataContext } from "@/context/TemperatureDataContext";
import { useConfigMessageCallback } from "@/hooks/useConfigMessageCallback";
import { useTemperaturePlayer } from "@/hooks/useTemperaturePlayer";
import PeltierUtils from "@/utils/PeltierUtils";
import { useContext, useEffect, useMemo, useState } from "react";
import { ReadyState } from "react-use-websocket";
import { twMerge } from "tailwind-merge";

type FlowState = "pick-music" | "get-temperature-profile";

const Experience = () => {
  const [currentState, setCurrentState] = useState<FlowState>("pick-music");
  const [maxScale, setMaxScale] = useState<number>(100);

  const {
    readyState,
    handleSendConfigMessage,
    setters: { setCurrentTemperatureMessage, setCurrentDirectionMessage },
    currentConfigs: { currentTemperatureMessage, currentDirectionMessage },
  } = useConfigMessageCallback();

  const { deltaT } = useContext(TemperatureDataContext);

  const {
    isPlaying,
    setIsPlaying,
    temperatureValues,
    currentTemperatureIndex,
    arousalValueDataPoints,
  } = useContext(TemperatureDataContext);

  /**
   * The unprocessed temperatures as _percentages_ for the current configuration
   */
  const currentTemperatures = useMemo(
    () => temperatureValues[currentTemperatureIndex],
    [temperatureValues, currentTemperatureIndex],
  );

  /**
   * The duty cycle for the current configuration - not directly sent over sockets
   */
  const dutyCycleValues = useMemo(
    () => PeltierUtils.percentageToDuty(currentTemperatures, maxScale),
    [currentTemperatures, maxScale],
  );

  const peltierDutyCycleString = `Current duty cycle(s):\n
        1: ${currentTemperatureMessage.peltier1Value}
        2: ${currentTemperatureMessage.peltier2Value}
        3: ${currentTemperatureMessage.peltier3Value}
        4: ${currentTemperatureMessage.peltier4Value}
        5: ${currentTemperatureMessage.peltier5Value}
  `;

  const peltierDirectionString = `
        Current direction(s):\n
        1: ${PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
        2: ${PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
        3: ${PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
        4: ${PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
        5: ${PeltierUtils.directionName(currentDirectionMessage.peltier1Direction)}
  `;

  useEffect(() => {
    setCurrentTemperatureMessage(dutyCycleValues.dutyCycles);
    setCurrentDirectionMessage(dutyCycleValues.directions);
    if (readyState === ReadyState.OPEN) {
      handleSendConfigMessage();
    }
  }, [
    dutyCycleValues,
    currentTemperatures,
    setCurrentDirectionMessage,
    setCurrentTemperatureMessage,
    maxScale,
    readyState,
    handleSendConfigMessage,
  ]);

  useTemperaturePlayer((val) => {
    if (val) console.log("tick!");
    else console.log("stopped");
  });

  const currentTimestamp = deltaT * currentTemperatureIndex;

  return (
    <div className="flex flex-col gap-4">
      <h1>Experience Haptics and Music!</h1>

      <Label htmlFor="max-duty">
        Set percentage of max temperature. Current: {maxScale}
      </Label>
      <Slider
        min={PeltierUtils.PELTIER_MIN_PERCENT}
        max={PeltierUtils.PELTIER_MAX_PERCENT}
        value={[maxScale]}
        onValueChange={(value) => setMaxScale(value[0])}
        id="max-duty"
      />
      <MusicPlayer
        isPlaying={isPlaying}
        play={() => {
          setIsPlaying?.(true);
        }}
        pause={() => {
          setIsPlaying?.(false);
        }}
        onFileValidityChange={(valid) => {
          if (valid) {
            setCurrentState("get-temperature-profile");
          }
        }}
        showPlayButton={readyState === ReadyState.OPEN}
      />
      <span
        className={twMerge(
          currentState === "pick-music" && "blur-sm pointer-events-none",
        )}
      >
        <TemperatureUpload />
      </span>
      {arousalValueDataPoints && (
        <ArousalGraph
          data={arousalValueDataPoints}
          currentTimestamp={currentTimestamp}
        />
      )}
      <h5>
        <strong>{peltierDutyCycleString}</strong>
        <br />
        <strong>{peltierDirectionString}</strong>
      </h5>
      <ArmHeatmap currentTemperatureValues={currentTemperatures} />
    </div>
  );
};

export default Experience;
