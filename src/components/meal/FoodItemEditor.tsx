import { FoodItem } from '../../types/meal'

interface FoodItemEditorProps {
  item: FoodItem
  onGramsChange: (newGrams: number) => void
}

export default function FoodItemEditor({ item, onGramsChange }: FoodItemEditorProps) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800/50">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium text-sm">{item.name}</p>
        <p className="text-sm text-zinc-400">{item.macros.calories} kcal</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="text-xs text-zinc-500">Grams:</label>
        <input
          type="number"
          value={item.grams}
          onChange={(e) => onGramsChange(parseInt(e.target.value) || 0)}
          className="w-20 px-3 py-1.5 bg-zinc-800 rounded-lg text-sm text-center border border-zinc-700 focus:outline-none focus:border-zinc-500"
        />
        <div className="flex-1 flex gap-3 justify-end text-[11px] text-zinc-400">
          <span>P {item.macros.protein}g</span>
          <span>C {item.macros.carbs}g</span>
          <span>F {item.macros.fat}g</span>
          <span>L {item.macros.fiber}g</span>
        </div>
      </div>
    </div>
  )
}
