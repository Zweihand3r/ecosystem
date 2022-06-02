Math.clamp = (x, a, b) => Math.min(Math.max(x, a), b)
Math.lerp = (a, b, x) => a + (b - a) * Math.clamp(x, 0, 1)
Math.inverseLerp = (a, b, x) => Math.clamp((x - a) / (b - a), 0, 1)

Math.rad2Deg = a => a * 180 / Math.PI