import "./App.css";
import { CocktailCard } from "./CocktailCard";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export interface Cocktail {
  idDrink: number;
  strDrink: string;
  strDrinkThumb: string;
  strDrinkAlternate?: string;
  strTags?: string[];
  strVideo?: string;
  strCategory?: string;
  strIBA?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  strInstructionsES?: string;
  strInstructionsDE?: string;
  strInstructionsFR?: string;
  strInstructionsIT?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strImageSource?: string;
  strImageAttribution?: string;
  strCreativeCommonsConfirmed?: string;
  dateModified?: string;
}

export const App = () => {
  const [selectedCocktailId, setSelectedCocktailId] = useState<number | null>();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const cocktailBuildingMethods: string[] = [
    "Building",
    "Shaking",
    "Stirring",
    "Garnishing",
    "Pouring",
  ];

  const { data: cocktails, isLoading: isLoadingCocktails } = useQuery({
    queryKey: ["cocktails"],
    queryFn: fetchCocktails,
  });

  const { data: selectedCocktail, isLoading: isLoadingCocktail } = useQuery({
    queryKey: ["selectedCocktail", selectedCocktailId],
    queryFn: fetchSelectedCocktail,
    enabled: !!selectedCocktailId,
  });

  function fetchCocktails() {
    return fetch(
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail",
    )
      .then((response) => response.json())
      .then((data) => (data.drinks as Cocktail[]) || []);
  }

  function fetchSelectedCocktail() {
    return fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${selectedCocktailId}`,
    )
      .then((response) => response.json())
      .then((data) => data.drinks[0] as Cocktail);
  }

  useEffect(() => {
    if (selectedCocktail) {
      const ingredients = Object.keys(selectedCocktail)
        .filter(
          (key) =>
            key.startsWith("strIngredient") && (selectedCocktail as any)[key],
        )
        .map((key) => (selectedCocktail as any)[key]);

      setIngredients(ingredients);
    }
  }, [selectedCocktail]);

  const closeModal = () => {
    setSelectedCocktailId(null);
  };

  return (
    <div className="mx-auto flex w-screen max-w-screen-2xl flex-col items-center p-8 md:p-14">
      {selectedCocktailId && (
        <section>
          <div
            onClick={closeModal}
            className="fixed inset-0 z-50 cursor-pointer bg-black/50 backdrop-blur-sm"
          ></div>
          <div className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center">
            <div className="pointer-events-auto mx-12 flex min-h-[200px] w-[800px] max-w-full flex-col overflow-clip rounded-lg bg-white">
              {isLoadingCocktail ? (
                <div className="mx-auto my-auto animate-pulse">
                  {!cocktailBuildingMethods.length
                    ? "Loading"
                    : cocktailBuildingMethods[Math.floor(Math.random() * 5)]}
                  {" your cocktail..."}
                </div>
              ) : !selectedCocktail ? null : (
                <div className="flex flex-row">
                  <div
                    className="relative left-0 top-0  bg-gray-400
                 "
                  >
                    <img
                      className="min-h-[100%] min-w-[100%]"
                      src={selectedCocktail.strDrinkThumb}
                      alt={selectedCocktail.strDrink}
                    />
                  </div>
                  <div className="relative flex w-full flex-col gap-4 p-12 ">
                    <button
                      onClick={closeModal}
                      className="absolute right-5 top-5"
                    >
                      <XCircleIcon className="h-[35px] text-black opacity-20 hover:opacity-100" />
                    </button>
                    <h1 className="font-pacifico text-2xl font-bold">
                      {selectedCocktail.strDrink}
                    </h1>
                    <div>
                      <div className="mb-2 font-medium">Glass</div>
                      <div>{selectedCocktail.strGlass}</div>
                    </div>
                    <div>
                      <div className="mb-2 font-medium">Ingredients</div>
                      <ul className="list-disc pl-[20px]">
                        {ingredients?.map((ingredient, index) => (
                          <li key={index}> {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <h1 className="mb-24 font-pacifico text-4xl font-bold">Cocktails</h1>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
        {isLoadingCocktails ? (
          <div className="animate-pulse">Loading cocktails...</div>
        ) : (
          cocktails?.map((cocktail) => (
            <div
              key={cocktail.idDrink}
              onClick={() => setSelectedCocktailId(cocktail.idDrink)}
            >
              <CocktailCard cocktail={cocktail} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
