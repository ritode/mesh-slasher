import * as THREE from 'three'
import * as React from 'react'

const calcParts = (result: THREE.Mesh) => {
  let parts: THREE.BufferGeometry[] = []
  const posMap = {}
  const positions = result.geometry.attributes.position
  if (positions.count === 0) return []
  const normals = result.geometry.attributes.normal
  const uvs = result.geometry.attributes.uv
  const cache = {}
  const hashify = (i) => {
    if (cache[i]) return cache[i]
    cache[i] = positions.getX(i).toFixed(2) + positions.getY(i).toFixed(2) + positions.getZ(i).toFixed(2)
    return cache[i]
  }
  for (let i = 0; i < positions.count; i += 3) {
    const vert1 = hashify(i)
    const vert2 = hashify(i + 1)
    const vert3 = hashify(i + 2)
    if (!posMap[vert1]) posMap[vert1] = []
    if (!posMap[vert2]) posMap[vert2] = []
    if (!posMap[vert3]) posMap[vert3] = []
    posMap[vert1].push(vert2, vert3)
    posMap[vert2].push(vert1, vert3)
    posMap[vert3].push(vert1, vert2)
  }
  let noPoses = {}
  while (Object.keys(noPoses).length < positions.count) {
    const availableIs: number[] = [] //Array(positions.length).fill()
    for (let i = 0; i < positions.count; i++) {
      if (!noPoses[hashify(i)]) availableIs.push(i)
    }
    if (availableIs.length === 0) break
    const randomPos = hashify(availableIs[0])
    const posesCollected = {}
    const posesToGoThrough = [randomPos]
    while (true) {
      if (posesToGoThrough.length === 0) break
      const pos = posesToGoThrough.pop()
      posesCollected[pos] = true
      const cs = posMap[pos]
      for (let i = 0; i < cs.length; i++) {
        if (!posesCollected[cs[i]]) posesToGoThrough.push(cs[i])
      }
    }
    const part = new THREE.BufferGeometry()
    const newPositions: number[] = []
    const newNormals: number[] = []
    const newUvs: number[] = []
    const madeTries: { [key: string]: boolean } = {}
    for (let i = 0; i < positions.count; i += 3) {
      const vert1 = hashify(i)
      const vert2 = hashify(i + 1)
      const vert3 = hashify(i + 2)
      const combined = vert1 + vert2 + vert3
      if (posesCollected[vert1] && posesCollected[vert2] && posesCollected[vert3] && !madeTries[combined]) {
        madeTries[vert1 + vert2 + vert3] = true
        madeTries[vert2 + vert3 + vert1] = true
        madeTries[vert3 + vert1 + vert2] = true
        noPoses[vert1] = true
        noPoses[vert2] = true
        noPoses[vert3] = true
        newPositions.push(positions.getX(i), positions.getY(i), positions.getZ(i))
        newPositions.push(positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1))
        newPositions.push(positions.getX(i + 2), positions.getY(i + 2), positions.getZ(i + 2))
        newNormals.push(normals.getX(i), normals.getY(i), normals.getZ(i))
        newNormals.push(normals.getX(i + 1), normals.getY(i + 1), normals.getZ(i + 1))
        newNormals.push(normals.getX(i + 2), normals.getY(i + 2), normals.getZ(i + 2))
        newUvs.push(uvs.getX(i), uvs.getY(i))
        newUvs.push(uvs.getX(i + 1), uvs.getY(i + 1))
        newUvs.push(uvs.getX(i + 2), uvs.getY(i + 2))
      }
    }
    part.setAttribute('position', new THREE.BufferAttribute(new Float32Array(newPositions), 3))
    part.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(newNormals), 3))
    part.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(newUvs), 3))
    parts.push(part)
  }
  return parts
}

const context = React.createContext<React.MutableRefObject<THREE.Group>>(null!)
export const Parts = React.forwardRef(({ children, ...props }: JSX.IntrinsicElements['group'], fref) => {
  const ref = React.useRef<THREE.Group>(null!)
  const lastGeo = React.useRef<THREE.BufferGeometry>(null!)
  React.useLayoutEffect(() => {
    const temp = ref.current as any
    if (lastGeo !== temp.geometry) {
      // If geometry doesn't match we need to re-calculate the parts
      lastGeo.current = temp.geometry
      temp.__parts = null
    }
  })
  React.useImperativeHandle(fref, () => ref.current, [])
  return (
    <context.Provider value={ref}>
      <group ref={ref} {...props}>
        {children}
      </group>
    </context.Provider>
  )
})

type PartProps = {
  index: number
  children: React.ReactNode | ((value: THREE.BufferGeometry, index: number, array: THREE.BufferGeometry[]) => React.ReactNode)
} & Omit<JSX.IntrinsicElements['mesh'], 'children'>

export const Part = React.forwardRef(({ index, children, ...props }: PartProps, fref) => {
  const [parts, setParts] = React.useState<THREE.BufferGeometry[]>([])
  const parent = React.useContext(context)
  const ref = React.useRef<THREE.Mesh>(null!)

  React.useEffect(() => {
    const temp = parent.current as any
    if (temp) {
      // Calculate parts only once to save time
      if (!temp.__parts) {
        try {
          temp.__parts = calcParts(temp)
          if (index !== undefined) {
            // TODO: display original to avoid fouc
            // If an index was given we update the geometry to its corresponding part
            if (temp.__parts[index]) ref.current.geometry = temp.__parts[index]
          } else {
            // If not, we use render-props to render all parts
            setParts(temp.__parts)
          }
        } catch (e) {
          console.warn(e)
        }
      }
    }
  })
  React.useImperativeHandle(fref, () => ref.current, [])
  return (
    <>
      {index !== undefined && !(children instanceof Function) ? (
        <mesh ref={ref} {...props}>
          {children}
        </mesh>
      ) : parts.length && children instanceof Function ? (
        parts.map(children)
      ) : null}
    </>
  )
})
