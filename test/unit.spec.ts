import { fixtures, getFixture } from '../test-utils'
import { example, parseSync } from "../src"
import expect from "expect"

describe("unit", () => {
  it("smoke test", () => {
    expect(example()).toEqual(true)
  })
})
