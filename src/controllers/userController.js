import UserRepository from "./../repositories/userRepository.js";

export async function getUser(req, res) {
  try {
    const { id } = req.params;

    const result = await UserRepository.getUserDetails(id);

    if (result.rowCount === 0) {
      return res.status(404).send({ msg: "This user does not exist." });
    }

    res.send(result.rows[0]);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export async function ranking(req, res) {
  try {
    const result = await UserRepository.getRanking();
    res.send(result.rows);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
