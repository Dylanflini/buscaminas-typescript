import { UseCase } from '../../domain/application/use-cases'

// Infrastructure

console.time('hola')

const initialData = {
	rows: 5,
	columns: 5,
	totalBombs: 2,
}

const buscaminas = new UseCase(initialData)

// UI
const $totalBombs = document.getElementById('total-bombs')
const root = document.getElementById('root')
const fragment = document.createDocumentFragment()

if ($totalBombs) {
	$totalBombs.textContent = initialData.totalBombs.toString()
}

buscaminas.getCells().forEach(cell => {
	const button = document.createElement('button')
	// button.style.width = '2rem'
	// button.style.height = '2rem'
	button.style.width = '4rem'
	button.style.height = '4rem'
	button.id = cell.getId().toString()
	fragment.appendChild(button)
})

const getColumns = (num: number) =>
	Array.from({ length: num })
		.map(() => '1fr')
		.join(' ')

if (root) {
	root.style.width = 'min-content'
	root.style.margin = 'auto'
	root.style.display = 'grid'
	root.style.gridTemplateColumns = getColumns(initialData.columns)
	root.appendChild(fragment)

	root.addEventListener('contextmenu', e => e.preventDefault())

	const secondClickListener = (e: MouseEvent) => {
		e.preventDefault()
		const button = e.target as HTMLButtonElement

		const ID = Number(button.id)

		const cell = buscaminas.getCells()[ID]

		// if(cell.wasMarkedAsBomb)
		if (!button.disabled) {
			if (buscaminas.isCellMarkedHasBomb(ID)) {
				button.textContent = ''
				buscaminas.unCheckAsBomb(ID)
			} else if (buscaminas.table.getRemainingBoms() > 0) {
				button.textContent = '🕵️‍♂️'
				buscaminas.markCellAsBomb(ID)
			}
		}

		if ($totalBombs) {
			$totalBombs.textContent = buscaminas.table.getRemainingBoms().toString()
		}

		// buscaminas.isCellMarkedHasBomb(ID)
		// 	? buscaminas.unCheckAsBomb(ID)
		// 	: buscaminas.markCellAsBomb(ID)

		// buscaminas.getCells().forEach(cell => {
		// 	if (cell.wasMarkedAsBomb && !button.disabled) {
		// 		const element = document.getElementById(
		// 			cell.id.toString()
		// 		) as HTMLButtonElement
		// 		element.textContent = '🕵️‍♂️'
		// 		return
		// 	}

		// 	const element = document.getElementById(
		// 		cell.id.toString()
		// 	) as HTMLButtonElement
		// 	if (!element.disabled) {
		// 		element.textContent = ''
		// 	}
		// })
	}

	root.addEventListener('contextmenu', secondClickListener)

	const exposeCellListener = (e: MouseEvent) => {
		const { id } = e.target as HTMLButtonElement
		const ID = Number(id)

		const exposedCells = buscaminas.exposeCell(ID)
		console.log({ exposedCells })

		exposedCells.forEach(cell => {
			const element = document.getElementById(
				cell.getId().toString()
			) as HTMLButtonElement
			if (element) {
				if (cell.isBomb) {
					element.style.backgroundColor = 'red'
					console.log(cell)
					return
				}

				const text =
					cell.getTotalBombsAround() !== 0 && !cell.isBomb
						? cell.getTotalBombsAround()?.toString()
						: ''
				element.textContent = text
				element.disabled = true
			}
		})
	}

	root.addEventListener('click', exposeCellListener)

	buscaminas.onLose(() => {
		console.log('perdiste')
		root?.removeEventListener('click', exposeCellListener)
		root?.removeEventListener('contextmenu', secondClickListener)
	})

	buscaminas.onWin(() => {
		console.log('ganaste')
		root?.removeEventListener('click', exposeCellListener)
		root?.removeEventListener('contextmenu', secondClickListener)

		buscaminas.getCells().forEach(cell => {
			const element = document.getElementById(
				cell.getId().toString()
			) as HTMLButtonElement
			if (element) {
				if (cell.isExposed()) {
					console.log('paso')

					// const text =
					// 	buscaminas.table.getTotalBombsAround(cell) !== 0 && !cell.isBomb
					// 		? buscaminas.table.getTotalBombsAround(cell)?.toString()
					// 		: ''
					// element.textContent = text
					element.disabled = true
				}
			}
		})
	})
}

// buscaminas.getCells().forEach(cell => {
// 	const a = document.getElementById(cell.getId().toString())
// 	if (a) {
// 		a.textContent = cell.getTotalBombsAround().toString()
// 		if (cell.isBomb) {
// 			a.style.backgroundColor = 'yellow'
// 		}
// 		if(cell.isExposed()){
// 			a.style.color = 'red'
// 		}
// 	}
// })

console.timeEnd('hola')

console.log(buscaminas)
