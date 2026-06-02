import { MacroNutrients } from '../../types/nutrition'

interface MacroSummaryProps {
  macros: MacroNutrients
  size?: 'sm' | 'lg'
}

export default function MacroSummary({ macros, size = 'lg' }: MacroSummaryProps) {
  const textSize = size === 'lg' ? 'text-2xl' : 'text-lg'
  const labelSize = size === 'lg' ? 'text-[10px]' : 'text-[9px]'

  return (
    <div className="flex justify-around text-center">
      <div>
        <p className={`${textSize} font-bold`}>{macros.calories}</p>
        <p className={`${labelSize} text-zinc-400 uppercase tracking-wider`}>kcal</p>
      </div>
      <div>
        <p className={`${textSize} font-bold`}>{macros.protein}</p>
        <p className={`${labelSize} text-zinc-400 uppercase tracking-wider`}>protein</p>
      </div>
      <div>
        <p className={`${textSize} font-bold`}>{macros.carbs}</p>
        <p className={`${labelSize} text-zinc-400 uppercase tracking-wider`}>carbs</p>
      </div>
      <div>
        <p className={`${textSize} font-bold`}>{macros.fat}</p>
        <p className={`${labelSize} text-zinc-400 uppercase tracking-wider`}>fat</p>
      </div>
      <div>
        <p className={`${textSize} font-bold`}>{macros.fiber}</p>
        <p className={`${labelSize} text-zinc-400 uppercase tracking-wider`}>lif</p>
      </div>
    </div>
  )
}
