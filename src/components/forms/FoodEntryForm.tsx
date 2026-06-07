import { X } from 'lucide-react'
import { FoodItemFormData } from '../../types/meal'
import Input from '../ui/Input'

interface FoodEntryFormProps {
  index: number
  entry: FoodItemFormData
  onChange: (index: number, field: keyof FoodItemFormData, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export default function FoodEntryForm({
  index,
  entry,
  onChange,
  onRemove,
  canRemove,
}: FoodEntryFormProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-400 uppercase tracking-wider">
          Item {index + 1}
        </span>
        {canRemove && (
          <button type="button"
            onClick={() => onRemove(index)}
            className="p-1 rounded-lg hover:bg-zinc-800"
          >
            <X size={14} className="text-zinc-500" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Food name"
          value={entry.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Grams"
            type="number"
            placeholder="0"
            value={entry.grams || ''}
            onChange={(e) => onChange(index, 'grams', e.target.value)}
          />
          <Input
            label="Calories /100g"
            type="number"
            placeholder="0"
            value={entry.caloriesPer100g || ''}
            onChange={(e) => onChange(index, 'caloriesPer100g', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Protein /100g"
            type="number"
            placeholder="0"
            value={entry.proteinPer100g || ''}
            onChange={(e) => onChange(index, 'proteinPer100g', e.target.value)}
          />
          <Input
            label="Carbs /100g"
            type="number"
            placeholder="0"
            value={entry.carbsPer100g || ''}
            onChange={(e) => onChange(index, 'carbsPer100g', e.target.value)}
          />
          <Input
            label="Fat /100g"
            type="number"
            placeholder="0"
            value={entry.fatPer100g || ''}
            onChange={(e) => onChange(index, 'fatPer100g', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
