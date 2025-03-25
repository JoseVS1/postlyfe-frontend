export const Errors = ({errors}) => {
    return (
      <div>
          <ul>
              {errors.map((error, i) => (
                  <li key={i}>{error}</li>
              ))}
          </ul>
      </div>
    )
  }
  