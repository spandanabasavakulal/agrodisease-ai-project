import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  UploadCloud,
  X,
  ScanLine,
  Loader2,
  Leaf,
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DemoBadge,
  InfoField,
  PageHeader,
  Panel,
} from "@/components/common";
import { predictDisease } from "@/services/predictionService";
import { analysisStore, useAnalysis } from "@/hooks/useAnalysis";
import { formatConfidence } from "@/utils/diseaseMapping";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/detect")({
  head: () => ({
    meta: [
      { title: "Leaf Condition Detection — AgroDisease AI" },
      {
        name: "description",
        content:
          "Upload a tomato leaf image and analyze it using the AI condition detection model.",
      },
      {
        property: "og:title",
        content: "Leaf Condition Detection — AgroDisease AI",
      },
      {
        property: "og:description",
        content:
          "Upload a tomato leaf image to detect its visual condition.",
      },
    ],
  }),
  component: DetectPage,
});

const ACCEPT = ["image/jpeg", "image/png", "image/jpg"];


/* Convert model class names into readable names */
function formatCondition(condition: string) {
  const conditionNames: Record<string, string> = {
    dried_leaves: "Dried Leaves",
    healthy_leaves: "Healthy Leaves",
    leaves_with_stains: "Leaves With Stains",
    leaves_yellow_stains: "Leaves With Yellow Stains",
  };

  return conditionNames[condition] ?? condition;
}


/* Determine whether the detected leaf is healthy */
function isHealthy(condition: string) {
  return condition === "healthy_leaves";
}


/* Generate a description for the current model classes */
function getConditionDescription(condition: string) {
  const descriptions: Record<string, string> = {
    dried_leaves:
      "The model detected visual characteristics associated with dried leaves. Further assessment is required to determine the underlying cause.",

    healthy_leaves:
      "The model detected visual characteristics associated with healthy tomato leaves. No visible condition requiring agrochemical treatment was detected.",

    leaves_with_stains:
      "The model detected visible stains on the tomato leaf. The image classification does not determine the specific underlying pathogen or cause.",

    leaves_yellow_stains:
      "The model detected yellow staining on the tomato leaf. Further assessment is required to determine whether the cause is nutritional, environmental, or disease-related.",
  };

  return (
    descriptions[condition] ??
    "No description available for this detected condition."
  );
}


function DetectPage() {
  const { imageUrl, prediction } = useAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();


  const pick = (f?: File) => {
    if (!f) return;

    if (!ACCEPT.includes(f.type)) {
      toast.error("Please upload a JPG, JPEG or PNG image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      analysisStore.reset();

      analysisStore.set({
        imageUrl: reader.result as string,
      });
    };

    reader.readAsDataURL(f);
    setFile(f);
  };


  const remove = () => {
    setFile(null);

    analysisStore.reset();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };


  const analyze = async () => {
    if (!file) {
      toast.error("Choose an image first.");
      return;
    }

    setLoading(true);

    try {
      const p = await predictDisease(file);

      analysisStore.set({
        prediction: p,
        recommendation: null,
        recommendationChecked: false,
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>

      <PageHeader
        title="Leaf Condition Detection"
        description="Upload a clear photo of a single tomato leaf. Supported formats: JPG, JPEG, PNG."
      />


      <div className="grid gap-6 lg:grid-cols-5">

        {/* Upload section */}
        <Panel className="lg:col-span-3">

          {!imageUrl ? (

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                pick(e.dataTransfer.files[0]);
              }}
              className={cn(
                "flex min-h-80 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
                drag
                  ? "border-primary bg-accent"
                  : "border-input bg-leaf-soft",
              )}
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                <UploadCloud className="h-8 w-8" />
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                Upload Tomato Leaf Image
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Drag &amp; drop here, or choose a file · JPG, JPEG, PNG
              </p>

              <Button
                className="mt-5"
                size="lg"
                onClick={() => inputRef.current?.click()}
              >
                <ImageIcon />
                Choose Image
              </Button>

            </div>

          ) : (

            <div>

              <div className="relative overflow-hidden rounded-2xl bg-muted">

                <img
                  src={imageUrl}
                  alt="Uploaded tomato leaf"
                  className="mx-auto max-h-96 w-full object-contain"
                />

                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-forest/70 text-primary-foreground">

                    <Loader2 className="h-10 w-10 animate-spin" />

                    <div className="font-bold">
                      Analyzing leaf image...
                    </div>

                    <div className="text-sm opacity-85">
                      AI model is processing the image.
                    </div>

                  </div>
                )}

              </div>


              <div className="mt-4 flex flex-wrap gap-3">

                <Button
                  size="lg"
                  onClick={analyze}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ScanLine />
                  )}

                  Analyze Image
                </Button>


                <Button
                  size="lg"
                  variant="outline"
                  onClick={remove}
                  disabled={loading}
                >
                  <X />
                  Remove Image
                </Button>

              </div>

            </div>

          )}


          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />

        </Panel>


        {/* Prediction result */}
        <Panel
          className="lg:col-span-2"
          title="Prediction Result"
          icon={<Leaf className="h-4 w-4" />}
        >

          {!prediction ? (

            <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">
              {loading
                ? "Analyzing leaf image..."
                : "Upload an image to begin leaf condition detection."}
            </p>

          ) : (

            <div className="space-y-4">

              {prediction.isDemo && (
                <DemoBadge className="w-full justify-center py-1.5">
                  Demo Prediction — Real ML Model Not Connected
                </DemoBadge>
              )}


              <div className="grid grid-cols-2 gap-3">

                <InfoField
                  label="Crop"
                  value={prediction.crop}
                />


                <InfoField
                  label="Leaf Condition"
                  value={formatCondition(prediction.disease)}
                />


                <InfoField
                  label="Confidence"
                  value={formatConfidence(prediction.confidence)}
                />


                <InfoField
                  label="Status"
                  value={
                    isHealthy(prediction.disease)
                      ? "Healthy"
                      : "Requires Attention"
                  }
                />

              </div>


              <p className="text-sm text-muted-foreground">
                {getConditionDescription(prediction.disease)}
              </p>


              <Button
                size="lg"
                className="w-full"
                onClick={() =>
                  navigate({
                    to: "/recommendations",
                  })
                }
              >
                {isHealthy(prediction.disease)
                  ? "View Management Guidance"
                  : "Get Treatment Recommendation"}

                <ArrowRight />
              </Button>

            </div>

          )}

        </Panel>

      </div>

    </div>
  );
}