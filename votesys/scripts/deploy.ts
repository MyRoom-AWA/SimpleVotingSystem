import {ethers} from "hardhat";

async function main() {
    const System = await ethers.getContractFactory("votingSystem");
    const system = await System.deploy();

    await system.waitForDeployment();
    console.log("todoList deployed to:", system.address);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});