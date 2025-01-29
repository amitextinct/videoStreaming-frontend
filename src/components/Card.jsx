function Card({ user }) {
  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.fullName}</p>
    </div>
  );
}

export default Card;